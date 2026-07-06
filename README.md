# MatchMuse League

**We killed the WhatsApp World Cup spreadsheet — and made it feel like watching the stock market crash in real time with your friends.**

Friends create a private league and are randomly assigned World Cup teams. As matches play live, each team's win probability (live TxLINE odds) becomes their **portfolio value**. A goal fires an **AI Moment Card** explaining what just shifted. Highest cumulative portfolio at the end of the tournament wins the league.

> No betting. No wagers. Just team value, portfolios & bragging rights.

## Features

- **Live Match View** — three panels: match header (dynamic home/away flag-colour gradient), live events timeline, and a real-time win-probability chart (Recharts).
- **AI Moment Cards** — on a goal / red card / big odds swing, the screen pulses in the scoring team's colour and a Claude-generated 2-sentence insight slides down.
- **Live Leaderboard** — friends ranked by portfolio value with animated rank changes, gold/silver/bronze medals, and per-day deltas.
- **Match Story** — auto-generated post-match recap (top turning points + biggest momentum swing) you can save as a shareable image.
- **The world on one screen** — every team is themed with its real flag colours, so France vs Brazil is blue/red vs green/yellow.

## Tech

React 18 · Vite · TailwindCSS · Recharts · React Router · Anthropic Claude (`claude-sonnet-4-6`) · TxLINE World Cup API · localStorage (no backend).

## Setup

```bash
npm install
cp .env.example .env   # add your keys (optional — app runs in replay mode without them)
npm run dev
```

### Environment variables

```
VITE_TXLINE_API_KEY=your_txline_key_here
VITE_ANTHROPIC_API_KEY=your_anthropic_key_here
```

Both are **optional**. Without keys (or with the placeholder values) the app runs in **replay mode** using a built-in France 2–1 Brazil match, and Moment Cards use a local insight fallback — so the full experience is always demoable, even after matches end.

## Demo flow

1. **Home** → tap **"Live demo match"** to watch the France vs Brazil replay: goals fire Moment Cards, the odds chart animates, and the post-match Story appears at full time.
2. **Create league** → on the league screen tap **"Add demo friends"** → **Start Draft** to see the live leaderboard with portfolio values and today's fixtures.

## How it works

- `src/hooks/useLiveMatch.js` — polls TxLINE every 15s for real matches; runs a virtual-clock **replay engine** for the demo match and graceful fallback. Returns score, events and an odds time-series.
- `src/services/txline.js` — TxLINE API client + defensive response normalizers; degrades to last-known data on failure ("showing last known data" badge).
- `src/services/anthropic.js` — calls Claude for Moment insights with a templated local fallback.
- `src/lib/league.js` — league/draft/portfolio logic, all persisted in `localStorage`.

## Build / Deploy

```bash
npm run build      # outputs to dist/
```

Deploys to Vercel as a static SPA (`vercel.json` rewrites all routes to `index.html`). `html2canvas` is code-split and loaded only when exporting a Match Story.
