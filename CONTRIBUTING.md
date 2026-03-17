# Contributing to BLR IT Pulse

First off — thank you. This dashboard only works if the community keeps the data honest. Every data point matters.

---

## Two ways to contribute

### Option A — No coding required (easiest)

[Open a GitHub Issue](https://github.com/parth-bhadra/blr-it-pulse/issues/new?template=data_point.yml) using the "Data Point Submission" template. Fill in the indicator, the value you observed, your source, and the date. A maintainer will update the JSON files and merge it within ~48 hours.

### Option B — Submit a Pull Request (preferred for regular contributors)

1. Fork the repo and clone it
2. Navigate to the `/data` folder
3. Edit the relevant JSON file (see guide below)
4. Run `node scripts/validate-data.js` to check your changes
5. Open a PR with a clear description of what you changed and why

---

## Which file to edit

| What you're updating | File |
|---|---|
| BSE IT index, stock prices, US layoffs | `data/market.json` |
| Naukri/LinkedIn job posting volumes, campus hiring | `data/hiring.json` |
| Office real estate, vehicle registrations, F&B, upskilling | `data/blr-ground.json` |
| College placement rates, salary data | `data/education.json` |
| Composite risk score, signal feed headlines | `data/scores.json` |

---

## Editing a data file

Every file has a `_meta` block at the top. Always update `last_updated` and `updated_by` when you make a change:

```json
"_meta": {
  "last_updated": "2026-04-01",
  "updated_by": "your-github-username"
}
```

### Updating a numeric indicator

Find the relevant key and update the value. For example, to update the BSE IT index in `market.json`:

```json
"bse_it_index": {
  "current": 38450,   // ← update this
  ...
}
```

Then add a history entry:

```json
"history": [
  ...
  { "date": "2026-04-01", "value": 38450 }   // ← append new entry
]
```

### Adding a signal feed item

In `scores.json`, add to the `signal_feed` array:

```json
{
  "id": "unique_snake_case_id",
  "text": "Concise headline describing the signal (under 120 chars)",
  "date": "2026-04-01",
  "category": "market",
  "signal": "bearish",
  "source": "Publication or data source name"
}
```

Valid categories: `market`, `hiring`, `blr_ground`, `education`
Valid signals: `bearish`, `warning`, `neutral`, `healthy`, `growing`

---

## Data quality standards

- **Always cite a source.** URLs are best. "Community observation" is acceptable with a description of methodology.
- **Be conservative.** If you're unsure, note it in the PR description. Overstating risk is as harmful as understating it.
- **Use the correct date.** Set `last_updated` to the date the data was *observed*, not the date of your PR.
- **No invented data.** If a data point is an estimate, mark it with a note: `"note": "Estimated from sample of 50 Naukri searches"`.
- **Percentage changes** should be YoY (year-over-year) unless otherwise specified.

---

## Running locally

```bash
git clone https://github.com/parth-bhadra/blr-it-pulse.git
cd blr-it-pulse
npm install
npm run dev
```

Open `http://localhost:5173`

To validate data files:
```bash
node scripts/validate-data.js
```

---

## What makes a good data contributor

The most valuable contributors track **one or two indicators consistently** over months — not one-off updates. If you're willing to own a specific indicator (e.g. you check Naukri BLR job postings every month), open an issue saying so and we'll add you to the `MAINTAINERS.md`.

---

## Code of conduct

Be accurate. Be kind. Don't use this dashboard to spread fear or agenda — the goal is to help real people in Bangalore make better career decisions with better information.

---

## Questions?

Open a [Discussion](https://github.com/parth-bhadra/blr-it-pulse/discussions) or ping the maintainers in the issue.
