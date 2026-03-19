# BLR IT Pulse 📡

**An open-source dashboard tracking AI disruption signals across Bangalore's IT ecosystem.**

Built for IT professionals in Bangalore who want to track — not guess — how structural changes in the industry are actually playing out on the ground.

[![Deploy](https://github.com/parth-bhadra/blr-it-pulse/actions/workflows/deploy.yml/badge.svg)](https://github.com/parth-bhadra/blr-it-pulse/actions/workflows/deploy.yml)
[![Data Validation](https://github.com/parth-bhadra/blr-it-pulse/actions/workflows/validate-data.yml/badge.svg)](https://github.com/parth-bhadra/blr-it-pulse/actions/workflows/validate-data.yml)
[![MIT License](https://img.shields.io/badge/license-MIT-orange.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## Live dashboard

🔗 **[blr-it-pulse.github.io](https://parth-bhadra.github.io/blr-it-pulse)**

---

## What this tracks

The dashboard is organized into 4 signal layers, each updated at different cadences:

### Layer 1 — Market signals (weekly, auto)
- BSE IT Index and major IT stocks (TCS, Infosys, Wipro, HCL)
- US tech layoff volumes via Layoffs.fyi — historically precedes Bangalore impact by 2–3 quarters
- Utilisation rates from quarterly earnings commentary

### Layer 2 — Hiring signals (monthly, community)
- Job posting volumes by role category on Naukri and LinkedIn: Manual QA, L1/L2 Support, Fresher IT, AI/ML, Cloud/Security
- "AI tools required" as % of all tech JDs — a structural shift indicator
- Campus hiring numbers from Big 4 IT companies

### Layer 3 — BLR ground truth (quarterly, community)
- Grade A office absorption and vacancy rates (Whitefield, ORR, Electronic City, Hebbal)
- Consumer economy proxies: vehicle registrations, residential demand, F&B index
- Upskilling enrollment spikes (counter-intuitive anxiety indicator)

### Layer 4 — Education & placement (bi-annual, community)
- Placement rates at top-tier Bangalore engineering colleges
- Average offer packages and offer-to-joining ratios
- Role disruption risk matrix with actionable career pivots

---

## Composite risk score

A weighted aggregate of all 14 tracked indicators, scored 0–100:

| Score | Label | Meaning |
|---|---|---|
| 0–40 | LOW | Structural demand healthy, normal hiring cycles |
| 41–55 | MODERATE | Some softening, monitor closely |
| 56–70 | ELEVATED | Clear signals of structural change, act proactively |
| 71–85 | HIGH | Significant displacement underway |
| 86–100 | CRITICAL | Acute disruption across multiple signals |

Current score: **65 / 100 — ELEVATED** *(March 2026)*

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Charts | Chart.js + react-chartjs-2 |
| Data | Static JSON files in `/data` (community-maintained) |
| Deployment | GitHub Pages via GitHub Actions |
| Validation | Node.js script (`scripts/validate-data.js`) |
| Fonts | IBM Plex Mono + IBM Plex Sans |

No backend. No database. No API keys required to run locally. The entire data layer is JSON files that anyone can edit via a PR.

---

## Running locally

```bash
# Clone
git clone https://github.com/parth-bhadra/blr-it-pulse.git
cd blr-it-pulse

# Install frontend dependencies
npm install

# Dev server
npm run dev
# → http://localhost:5173

# Validate data files
node scripts/validate-data.js

# Production build
npm run build
```

### Data fetching (Docker)

```bash
# Build data fetcher image
docker build -t blr-it-pulse-data .

# Fetch all data
docker run --rm -v "$(pwd)/data:/app/data" blr-it-pulse-data

# With Adzuna API keys (for better job data)
docker run --rm \
  -v "$(pwd)/data:/app/data" \
  -e ADZUNA_APP_ID=xxx \
  -e ADZUNA_APP_KEY=xxx \
  blr-it-pulse-data
```

Get free Adzuna API keys at [developer.adzuna.com](https://developer.adzuna.com).

---

## Project structure

```
blr-it-pulse/
├── data/                    # ← All tracked indicator data (community-maintained)
│   ├── market.json          # BSE IT index, stocks, US layoffs
│   ├── hiring.json          # Job postings, campus hiring
│   ├── blr-ground.json      # Real estate, consumer economy
│   ├── education.json       # College placements, role risk matrix
│   └── scores.json          # Composite score + signal feed
│
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── RiskMeter.jsx    # Composite score gauge
│   │   ├── MarketLayer.jsx
│   │   ├── HiringLayer.jsx
│   │   ├── BLRGroundLayer.jsx
│   │   ├── EducationLayer.jsx
│   │   ├── SignalFeed.jsx   # Scrolling headline ticker
│   │   ├── ContributeBar.jsx
│   │   ├── ContributeModal.jsx
│   │   ├── Footer.jsx
│   │   └── ui.jsx           # Shared primitives
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── scripts/
│   ├── validate-data.js     # JSON schema validator (run in CI)
│   ├── fetch-all-data.py     # Master script (runs all fetchers)
│   ├── fetch-market-data.py  # BSE IT Index & stock prices
│   └── fetch-hiring-data.py  # Job counts (Adzuna API / Naukri)
│
├── .github/
│   ├── workflows/
│   │   ├── deploy.yml       # Auto-deploy to GitHub Pages on push to main
│   │   ├── validate-data.yml # Validate JSON on data PRs
│   │   └── fetch-data.yml   # Weekly auto-fetch of market & hiring data
│   └── ISSUE_TEMPLATE/
│       └── data_point.yml   # Structured issue form for data contributions
│
├── Dockerfile               # Data fetcher container
├── .dockerignore
├── requirements.txt         # Python dependencies (yfinance, playwright)
├── CONTRIBUTING.md
└── README.md
```

---

## Contributing

This dashboard runs on community data. If you work in Bangalore's IT ecosystem — as a hiring manager, recruiter, engineer, student, or observer — you can contribute.

**The most valuable thing you can do:** own one indicator and update it consistently every month.

👉 See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

**Quick contribution (no coding needed):**
[Open a Data Point Issue](https://github.com/parth-bhadra/blr-it-pulse/issues/new?template=data_point.yml)

---

## Why this exists

Bangalore's IT workforce of ~1.5 million people deserves better signal than quarterly earnings calls and newspaper headlines. This dashboard aggregates leading indicators — some obvious, some indirect — so individuals can make proactive career decisions rather than reactive ones.

The goal is not to spread fear. It's to replace anxiety with information.

---

## Roadmap

- [x] Auto-fetch BSE IT index via Yahoo Finance API
- [ ] Auto-fetch Layoffs.fyi RSS feed via GitHub Action
- [ ] Historical score chart (composite score over time)
- [ ] Email/WhatsApp digest for weekly summary
- [ ] Individual role risk calculator
- [ ] Expand to Chennai, Hyderabad, Pune (sister dashboards)

---

## License

[MIT](LICENSE) — free to fork, adapt, and deploy for other cities or contexts.

---

## Maintainers

- [@parth-bhadra](https://github.com/parth-bhadra) — founder

Want to be a maintainer? Open an issue.
