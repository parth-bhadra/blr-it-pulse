#!/usr/bin/env python3
"""
BLR IT Pulse - Market Data Fetcher
Fetches BSE IT Index, IT stock prices, and US layoffs data.
Run: python scripts/fetch-market-data.py
"""

import json
import sys
from datetime import datetime
from pathlib import Path

try:
    import yfinance as yf
except ImportError:
    print("Error: yfinance not installed. Run: pip install yfinance")
    sys.exit(1)


SCRIPT_DIR = Path(__file__).parent.parent
DATA_DIR = SCRIPT_DIR / "data"
MARKET_FILE = DATA_DIR / "market.json"


def load_json(filepath):
    with open(filepath, "r") as f:
        return json.load(f)


def save_json(filepath, data):
    with open(filepath, "w") as f:
        json.dump(data, f, indent=2)
        f.write("\n")


def get_bse_it_index():
    ticker = yf.Ticker("^CNXIT")
    hist = ticker.history(period="6mo")
    
    if hist.empty:
        return None, None
    
    current = round(hist["Close"].iloc[-1])
    
    hist_data = []
    for i, (date, row) in enumerate(hist.iloc[-6:].iterrows()):
        hist_data.append({
            "date": date.strftime("%Y-%m-01"),
            "value": round(row["Close"])
        })
    
    return current, hist_data


def get_stock_data(tickers_info):
    stocks = []
    
    for ticker_info in tickers_info:
        ticker = yf.Ticker(ticker_info["yahoo_ticker"])
        hist = ticker.history(period="1d")
        
        if hist.empty:
            stocks.append(ticker_info)
            continue
        
        price = round(hist["Close"].iloc[-1] * ticker_info.get("price_multiplier", 1))
        
        ticker_info["price_inr"] = price
        stocks.append(ticker_info)
    
    return stocks


def calculate_signal(history_values):
    if len(history_values) < 2:
        return "neutral"
    
    recent_avg = sum(history_values[-3:]) / 3
    older_avg = sum(history_values[:-3]) / 3 if len(history_values) > 3 else history_values[0]
    
    if older_avg == 0:
        return "neutral"
    
    change_pct = ((recent_avg - older_avg) / older_avg) * 100
    
    if change_pct < -20:
        return "bearish"
    elif change_pct < -10:
        return "warning"
    elif change_pct < 10:
        return "neutral"
    else:
        return "healthy"


def main():
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M')}] Fetching market data...")
    
    data = load_json(MARKET_FILE)
    
    current_bse, bse_history = get_bse_it_index()
    if current_bse:
        data["bse_it_index"]["current"] = current_bse
        if bse_history:
            data["bse_it_index"]["history"] = bse_history
            values = [h["value"] for h in bse_history]
            data["bse_it_index"]["signal"] = calculate_signal(values)
        print(f"  BSE IT Index: {current_bse}")
    else:
        print("  Warning: Could not fetch BSE IT Index")
    
    stock_tickers = [
        {"ticker": "TCS", "yahoo_ticker": "TCS.NS", "price_multiplier": 1},
        {"ticker": "INFY", "yahoo_ticker": "INFY.NS", "price_multiplier": 1},
        {"ticker": "WIPRO", "yahoo_ticker": "WIPRO.NS", "price_multiplier": 1},
        {"ticker": "HCLTECH", "yahoo_ticker": "HCLTECH.NS", "price_multiplier": 1},
    ]
    
    stocks = get_stock_data(stock_tickers)
    
    for stock in stocks:
        if "price_inr" in stock:
            for old_stock in data["it_stocks"]:
                if old_stock["ticker"] == stock["ticker"]:
                    old_stock["price_inr"] = stock["price_inr"]
                    print(f"  {stock['ticker']}: {stock['price_inr']}")
                    break
    
    data["_meta"]["last_updated"] = datetime.now().strftime("%Y-%m-%d")
    data["_meta"]["updated_by"] = "auto-fetcher"
    
    save_json(MARKET_FILE, data)
    print("Done!")


if __name__ == "__main__":
    main()
