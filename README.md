# Kickoff Cards

**A free-to-play World Cup 2026 collectible card game, powered by live TxLINE match data on Solana.**

You always argue with a friend about who called the match right. Kickoff Cards settles it. Collect player and team cards, **back one before each match**, and watch it **resolve on real World Cup data** — win a bonus card and Instinct Points, or watch your card burn. Highest card total in your league wins.

> Free to play. No real money, no wagers, no monetary value. Just cards, predictions and bragging rights.

## The core loop

1. **Collect** — build a starter collection of player cards (legend / rare / common) and team cards.
2. **Back a card** — before a match kicks off, stake a card on a prediction (a player scores, a team wins, etc.).
3. **Resolve on live data** — TxLINE streams the real score and match events. When the match finishes, stakes resolve automatically.
4. **Earn or burn** — a correct call earns a bonus card + Instinct Points; a wrong call burns the card (revivable once with Instinct Points). League standings are the sum of your owned cards' points.

## Two modes

- **Demo match** — a scripted France–Brazil replay so the full collect → back → resolve → earn/burn loop is always playable, even outside tournament windows.
- **Live World Cup** — the `/live` hub lists real fixtures from TxLINE. Activate live data with your Solana wallet and open any real match to follow live score, odds and events.

## Tech

React 19 · Vite 8 · React Router v7 · TailwindCSS 3 · framer-motion · Recharts · Solana wallet-adapter (`@solana/web3.js`, `@coral-xyz/anchor`, `@solana/spl-token`) · TxLINE World Cup API · localStorage (no backend).

## TxLINE + Solana integration

Live data is gated behind a wallet-driven, on-chain activation handshake (Solana **devnet**):

1. Request a guest JWT from TxLINE.
2. Run an on-chain Anchor `subscribe()` transaction on Solana devnet.
3. Sign the transaction signature + JWT and activate the API token.

The activated token is cached in `localStorage` with a TTL. Once active, the app polls TxLINE every 15s for fixtures, scores, odds and events, and degrades to last-known data with a "Connection issue" badge on failure.

- `src/hooks/useFixtures.js` — polls the fixtures feed; falls back to sample fixtures.
- `src/hooks/useLiveMatch.js` — polls score / odds / events every 15s for real matches; runs the replay engine for the demo match.
- `src/services/txline.js` — TxLINE REST client + defensive response normalizers.
- `src/wallet/` — wallet identity + the TxLINE activation handshake.

## Setup

```bash
npm install
cp .env.example .env   # add your keys (optional — the demo match runs without them)
npm run dev
```

### Environment variables

```
VITE_TXLINE_API_KEY=your_txline_key_here
VITE_ANTHROPIC_API_KEY=your_anthropic_key_here
```

Both are optional. Without keys the **demo match** and full card loop still work; live World Cup fixtures fall back to sample data until you activate live TxLINE access with a devnet wallet.

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
npm run lint       # oxlint
```

## Compliance

Kickoff Cards is a **free-to-play social card game**. No real money or monetary value is involved, and all on-chain activity runs on Solana **devnet**. A disclaimer to this effect is shown on every screen.
