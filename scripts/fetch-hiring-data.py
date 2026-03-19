#!/usr/bin/env python3
"""
BLR IT Pulse - Hiring Data Fetcher
Fetches job posting data from Adzuna API (primary) with Naukri scraping fallback.

Run: python scripts/fetch-hiring-data.py

Environment variables:
  ADZUNA_APP_ID - Your Adzuna App ID (https://developer.adzuna.com)
  ADZUNA_APP_KEY - Your Adzuna App Key
"""

import json
import os
import sys
import time
from datetime import datetime
from pathlib import Path

import requests

SCRIPT_DIR = Path(__file__).parent.parent
DATA_DIR = SCRIPT_DIR / "data"
HIRING_FILE = DATA_DIR / "hiring.json"

ADZUNA_APP_ID = os.environ.get("ADZUNA_APP_ID")
ADZUNA_APP_KEY = os.environ.get("ADZUNA_APP_KEY")

SEARCH_CONFIGS = {
    "manual_qa": {"adzuna": "manual testing", "naukri": "manual testing jobs bangalore"},
    "l1_l2_support": {"adzuna": "it support helpdesk", "naukri": "it support helpdesk jobs bangalore"},
    "fresher_it": {"adzuna": "software engineer fresher", "naukri": "software engineer fresher jobs bangalore"},
    "data_engineering": {"adzuna": "data engineer", "naukri": "data engineer jobs bangalore"},
    "ai_ml": {"adzuna": "machine learning engineer", "naukri": "machine learning engineer jobs bangalore"},
    "cloud_security": {"adzuna": "cloud security engineer", "naukri": "cloud security engineer jobs bangalore"},
}


def load_json(filepath):
    with open(filepath, "r") as f:
        return json.load(f)


def save_json(filepath, data):
    with open(filepath, "w") as f:
        json.dump(data, f, indent=2)
        f.write("\n")


def create_snapshot(data):
    import copy
    snapshot = {
        "date": datetime.now().strftime("%Y-%m-%d"),
        "job_postings": copy.deepcopy(data.get("job_postings", [])),
        "jd_signals": copy.deepcopy(data.get("jd_signals", {})),
    }
    if "snapshots" not in data:
        data["snapshots"] = []
    data["snapshots"].insert(0, snapshot)
    data["snapshots"] = data["snapshots"][:52]


def fetch_adzuna_count(search_term, location="Bangalore"):
    if not ADZUNA_APP_ID or not ADZUNA_APP_KEY:
        return None

    try:
        url = f"https://api.adzuna.com/v1/api/jobs/in/search/1/"
        params = {
            "app_id": ADZUNA_APP_ID,
            "app_key": ADZUNA_APP_KEY,
            "what": search_term,
            "where": location,
            "results_per_page": 0,
        }
        response = requests.get(url, params=params, timeout=15)
        response.raise_for_status()
        return response.json().get("count", 0)
    except Exception as e:
        print(f"    Adzuna error for '{search_term}': {e}")
        return None


def calculate_signal(yoy_pct):
    if yoy_pct <= -20:
        return "critical"
    elif yoy_pct <= -10:
        return "high"
    elif yoy_pct <= -5:
        return "warning"
    elif yoy_pct <= 5:
        return "neutral"
    return "growing"


def try_naukri_fallback(search_term):
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        return None

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            )
            page = context.new_page()

            url = f"https://www.naukri.com/jobs-in-bangalore-{search_term.replace(' ', '-')}"
            page.goto(url, timeout=30000, wait_until="domcontentloaded")
            time.sleep(2)

            page.wait_for_selector(".count-heading", timeout=10000)
            count_text = page.locator(".count-heading").text_content()

            count = 0
            for char in count_text:
                if char.isdigit():
                    count = count * 10 + int(char)

            browser.close()
            return count if count > 0 else None
    except Exception:
        return None


def fetch_job_counts():
    current_counts = {}

    for job_id, config in SEARCH_CONFIGS.items():
        print(f"  Fetching: {job_id}")

        count = fetch_adzuna_count(config["adzuna"])

        if count is None:
            print(f"    Adzuna unavailable, trying Naukri fallback...")
            count = try_naukri_fallback(config["naukri"])

        if count is not None:
            current_counts[job_id] = count
            print(f"    Found: {count} jobs")
        else:
            print(f"    Failed, keeping existing")
            current_counts[job_id] = None

    return current_counts


def main():
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M')}] Fetching hiring data...")

    if ADZUNA_APP_ID and ADZUNA_APP_KEY:
        print("Using Adzuna API (primary) + Naukri fallback")
    else:
        print("Adzuna credentials not set. Using Naukri scraping only.")
        print("Get free API keys at: https://developer.adzuna.com")

    data = load_json(HIRING_FILE)
    current_counts = fetch_job_counts()

    for job in data["job_postings"]:
        job_id = job["id"]

        if current_counts.get(job_id) is not None:
            current = current_counts[job_id]
            prev = job.get("current_monthly_postings", current)

            if prev > 0 and current > 0:
                yoy_change = round(((current - prev) / prev) * 100, 1)
            else:
                yoy_change = 0

            job["current_monthly_postings"] = current
            job["yoy_change_pct"] = yoy_change
            job["signal"] = calculate_signal(yoy_change)

            if len(job["trend"]) >= 6:
                job["trend"] = job["trend"][1:] + [yoy_change]
            else:
                job["trend"].append(yoy_change)

            print(f"  {job_id}: {current} jobs (YoY: {yoy_change:+.1f}%)")

    data["_meta"]["last_updated"] = datetime.now().strftime("%Y-%m-%d")
    data["_meta"]["updated_by"] = "auto-fetcher"

    create_snapshot(data)
    save_json(HIRING_FILE, data)
    print("Done!")


if __name__ == "__main__":
    main()
