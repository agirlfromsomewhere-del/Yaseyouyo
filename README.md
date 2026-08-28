# Yaseyouyo

An accessible, installable PWA for tracking weight, TDEE, and a deficit-based
weight goal — free, no server, no account, no AI, data stored only on your
device.

## Features

- Enter age, height, activity level, and either biological sex (Mifflin-St
  Jeor) or body-fat % (Katch-McArdle) to estimate your TDEE (maintenance
  calories).
- Set a goal weight and target date; the app works out the daily calorie
  target and deficit needed, and flags plans that are unsafely aggressive
  (below ~1200 kcal/day, or faster than ~1kg/week) as warnings.
- Log weight over time and food/calories per day, with a running budget and
  a streak counter for days logged and kept under budget.
- A static low-calorie food reference (no external API/food database key
  needed) filterable by category and by what fits your remaining budget
  today.
- Installable to your phone's home screen (Add to Home Screen in Safari/
  Chrome) — works offline once installed, since everything runs locally.

## Data & privacy

All data (profile, weight log, food log, goal) is stored only in this
browser's IndexedDB. Nothing is sent anywhere — the app makes zero network
requests.

## Not medical advice

TDEE and deficit math here use standard, widely-cited formulas and a common
~7700 kcal-per-kg-of-fat approximation. Real results vary by individual.
This is not medical advice and does not replace guidance from a doctor or
registered dietitian.

## Development

```bash
npm install
npm run dev
```

Regenerate icons after changing `public/icon.svg`:

```bash
node scripts/gen-icons.mjs
```

## Deployment

Auto-deploys to GitHub Pages via `.github/workflows/deploy.yml` on every
push to `main` (repo must have Pages set to "GitHub Actions" as its source
under Settings → Pages).
