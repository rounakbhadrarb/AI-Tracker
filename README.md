# AI Tracker — 90 Day Challenge

An offline-first Progressive Web App for tracking daily habits, books, DSA progress and
LeetCode volume across a 90-day challenge — with XP, levels, streaks, achievements and charts.

Built with **Next.js 15 · React 19 · TypeScript · Tailwind CSS 4**. All data is stored in
`localStorage` on your device — no account, no server, no network needed.

## Features

| Screen | What it does |
| --- | --- |
| **Dashboard** | Progress ring, current day (1–90), XP level bar, streak, today's completion %, motivational quote, one-tap quick check-in, 90-day heatmap |
| **Habits** | 14 one-tap habits grouped into Body / Mind, day-by-day navigation, LeetCode easy/medium/hard counters, daily note |
| **Learning** | Book progress bars, LeetCode donut breakdown, 15-topic DSA roadmap, notes |
| **Analytics** | Weekly bars, 7/30/90-day completion & XP trend lines, habit consistency ranking, solved-per-day chart, full heatmap, 13 achievements |
| **Settings** | Name, start date, challenge length, streak threshold, JSON export/import backup, reset |

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

Production:

```bash
npm run build
npm run start        # binds 0.0.0.0 so phones on the same Wi-Fi can reach it
```

## Install on iPhone

1. Make sure your iPhone and this computer are on the **same Wi-Fi**.
2. Open the printed **Network** URL (e.g. `http://192.168.0.110:3000`) in **Safari**.
3. Tap **Share → Add to Home Screen**.
4. Launch from the home screen — full screen, no browser chrome.

> iOS only enables service-worker offline caching on `https://` or `localhost`.
> Over plain LAN http the app still works and still saves data; for full offline
> support deploy to Vercel (free) and open the `https://` URL.

## Deploy free on Vercel

```bash
npx vercel        # or push to GitHub and import the repo at vercel.com
```

## Project structure

```
src/
  app/
    dashboard/    habits/    books/    analytics/    settings/
    layout.tsx    page.tsx   globals.css
  components/
    ProgressRing  XPBar  HabitCard  CalendarHeatmap  Charts  Navbar  Ui  PWARegister
  lib/
    types.ts  date.ts  habits.ts  stats.ts  store.tsx
public/
  manifest.webmanifest  sw.js  icons/
scripts/
  generate-icons.mjs        # regenerates PWA icons: npm run icons
```

## Scoring

- Each habit is worth 10–20 XP; a perfect day adds a 50 XP bonus.
- LeetCode: easy 2 XP, medium 5 XP, hard 10 XP, plus 10 XP for 3+ in a day.
- Level *n* requires `250 × n` XP.
- A day counts towards your streak once you pass the daily target % (default 70%, configurable).

## Backups

Data lives in this browser only. **Settings → Export backup** writes a JSON file;
**Import backup** restores it on any device.
