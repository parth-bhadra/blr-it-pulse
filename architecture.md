# BLR IT Pulse - Architecture

## Overview

BLR IT Pulse is an open-source dashboard tracking AI disruption signals across Bangalore's IT ecosystem. It aggregates leading indicators to help IT professionals make proactive career decisions.

**Repository**: [parth-bhadra/blr-it-pulse](https://github.com/parth-bhadra/blr-it-pulse)  
**Live Dashboard**: [parth-bhadra.github.io/blr-it-pulse](https://parth-bhadra.github.io/blr-it-pulse)

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18.2.0 + Vite 5.1.0 |
| **Charts** | Chart.js 4.4.1 + react-chartjs-2 5.2.0 |
| **Styling** | Inline styles + CSS variables |
| **Fonts** | IBM Plex Mono + IBM Plex Sans |
| **Icons** | Lucide React 0.383.0 |
| **Utilities** | date-fns 3.3.1 |
| **Data Scripts** | Python 3.12 + yfinance + Playwright |
| **Container** | Docker |
| **Data Layer** | Static JSON files |
| **Deployment** | GitHub Pages via GitHub Actions |

---

## Directory Structure

```
blr-it-pulse/
├── .github/
│   ├── workflows/
│   │   ├── deploy.yml       # GitHub Pages deployment
│   │   ├── validate-data.yml # JSON validation on PRs
│   │   └── fetch-data.yml    # Auto-fetch market & hiring data
│   └── ISSUE_TEMPLATE/
│       └── data_point.yml
│
├── data/                    # Tracked indicator data
│   ├── market.json         # BSE IT index, IT stocks, US layoffs
│   ├── hiring.json         # Job postings, campus hiring
│   ├── blr-ground.json     # Real estate, consumer economy
│   ├── education.json      # Placements, role risk matrix
│   └── scores.json         # Composite risk score
│
├── scripts/
│   ├── fetch-market-data.py   # Fetches BSE index, stock prices
│   ├── fetch-hiring-data.py   # Fetches job counts (Adzuna + Naukri)
│   ├── fetch-all-data.py      # Runs both fetchers
│   └── validate-data.js       # JSON schema validator
│
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   └── components/
│       ├── Header.jsx, RiskMeter.jsx, MarketLayer.jsx
│       ├── HiringLayer.jsx, BLRGroundLayer.jsx, EducationLayer.jsx
│       ├── SignalFeed.jsx, ContributeBar.jsx, ContributeModal.jsx
│       ├── Footer.jsx, ui.jsx
│
├── public/favicon.svg
├── Dockerfile               # Data fetcher container
├── .dockerignore
├── index.html
├── vite.config.js
├── package.json
└── requirements.txt        # Python dependencies
```

---

## Data Architecture

### Signal Layers

| Layer | Source File | Update Frequency | Update Method |
|-------|-------------|------------------|---------------|
| **Market signals** | `market.json` | Weekly (auto) | Yahoo Finance API |
| **Hiring signals** | `hiring.json` | Weekly (auto) | Adzuna API + Naukri fallback |
| **BLR ground truth** | `blr-ground.json` | Quarterly | Community PR |
| **Education & placement** | `education.json` | Bi-annual | Community PR |

### Data Sources

| Data | Source | Automatable |
|------|--------|-------------|
| BSE IT Index | Yahoo Finance (`^CNXIT`) | ✅ Yes |
| Stock prices | Yahoo Finance (TCS.NS, etc.) | ✅ Yes |
| Job posting counts | Adzuna API + Naukri scrape | ⚠️ Partial |
| Campus hiring | Company press releases | ❌ Manual |
| Ground truth | Community observations | ❌ Manual |

### Historical Snapshots

Automated data files preserve historical snapshots before each update:

- **Location**: `snapshots[]` array within each data file
- **Retention**: Last 52 weekly snapshots (1 year)
- **Trigger**: Automatically saved by fetch scripts before updating current values
- **Access**: Available in frontend via `data.market.json.snapshots`

Example snapshot structure:
```json
"snapshots": [
  {
    "date": "2026-03-19",
    "bse_it_index": { "current": 28580, ... },
    "it_stocks": [...],
    "us_layoffs": {...}
  }
]
```

---

## Component Architecture

```
App (App.jsx)
├── Header
├── RiskMeter (MiniBar)
├── MarketLayer (Card, IndRow, Line, Bar charts)
├── HiringLayer (Card, IndRow, Bar charts, RiskTag)
├── BLRGroundLayer (Card, IndRow, RiskTag)
├── EducationLayer (Card, IndRow, RiskTag)
├── SignalFeed
├── ContributeBar
├── ContributeModal
└── Footer
```

---

## CI/CD Pipeline

### Workflows

1. **deploy.yml** - On push to master
   - Builds React app
   - Deploys to GitHub Pages

2. **fetch-data.yml** - Weekly (Mondays 6 AM UTC)
   - Builds Docker container
   - Fetches market data (Yahoo Finance)
   - Fetches hiring data (Adzuna / Naukri)
   - Creates PR with updated JSON files

3. **validate-data.yml** - On PR to `data/**`
   - Validates JSON schema
   - Checks data types and ranges

---

## Data Automation

### Market Data Fetcher (`scripts/fetch-market-data.py`)

Fetches from Yahoo Finance:
- BSE IT Index (`^CNXIT`) with 6-month history
- Stock prices: TCS, INFY, WIPRO, HCLTECH
- Auto-calculates signal based on trend

### Hiring Data Fetcher (`scripts/fetch-hiring-data.py`)

Sources (in order of preference):
1. **Adzuna API** (primary) - Free job aggregation API
2. **Naukri.com scraping** (fallback) - Playwright-based

Job categories tracked:
- Manual QA / Testing
- L1 / L2 IT Support
- Fresher IT (0-2 yrs)
- Data Engineering
- AI / ML Engineering
- Cloud / Cybersecurity

### Docker Setup

```bash
# Build image
docker build -t blr-it-pulse-data .

# Run all fetchers
docker run --rm -v "$(pwd)/data:/app/data" blr-it-pulse-data

# Run specific fetcher
docker run --rm -v "$(pwd)/data:/app/data" blr-it-pulse-data python scripts/fetch-market-data.py
docker run --rm -v "$(pwd)/data:/app/data" blr-it-pulse-data python scripts/fetch-hiring-data.py

# With Adzuna API keys
docker run --rm \
  -v "$(pwd)/data:/app/data" \
  -e ADZUNA_APP_ID=xxx \
  -e ADZUNA_APP_KEY=xxx \
  blr-it-pulse-data
```

### Required Secrets

For GitHub Actions, add these secrets:
- `ADZUNA_APP_ID` - From [developer.adzuna.com](https://developer.adzuna.com)
- `ADZUNA_APP_KEY` - From developer portal

---

## Build Commands

### Frontend (Node.js)

```bash
npm install      # Install dependencies
npm run dev      # Start dev server (localhost:5173)
npm run build    # Production build to dist/
npm run preview  # Preview production build
```

### Data Scripts (Docker)

```bash
# Build
docker build -t blr-it-pulse-data .

# Fetch all data
docker run --rm -v "$(pwd)/data:/app/data" blr-it-pulse-data
```

### Validation

```bash
node scripts/validate-data.js   # Validate JSON data
```

---

## State Management

- **Minimal local state**: Only `modalOpen` in `App.jsx`
- **No global state library**: Props-driven data flow
- **No API calls at runtime**: Data imported from JSON at build time

---

## Contribution Model

### Automated Updates
- Market data: Updated weekly via GitHub Actions
- Hiring data: Updated weekly via GitHub Actions

### Manual Contributions

1. **No-code**: GitHub Issue with `data_point.yml` template
2. **Code**: Edit JSON files in a PR

### Data Quality Standards

- Always cite a source (URL preferred)
- Be conservative - don't overstate risk
- Use correct observation dates (YYYY-MM-DD)
- Mark estimates with notes
- Percentage changes should be YoY unless specified
- Update `_meta.last_updated` and `_meta.updated_by`

---

## Styling

- Inline styles with CSS variables (`index.css`)
- No CSS framework
- Custom scrollbar styling

```css
:root {
  --bg: #0a0c0f;
  --bg2: #111318;
  --accent: #f97316;
  --green: #22d3a0;
  --red: #f43f5e;
  --mono: 'IBM Plex Mono', monospace;
  --sans: 'IBM Plex Sans', sans-serif;
}
```

---

## Notable Features

- **Circular Risk Gauge**: SVG-based animated gauge
- **Scrolling Signal Feed**: CSS animation ticker with pause-on-hover
- **Responsive Grid**: Auto-fit two-column layout
- **Color-coded Indicators**: Semantic coloring by signal type
- **Live Badge Animation**: Pulsing indicator
- **Contribution Modal**: In-app data submission form
- **Automated Data Fetching**: Weekly market & hiring data updates
