# Kickoff Cards — Stitch prompt (immersive motion landing)

One prompt for Stitch (Google) to design an immersive, motion-driven landing
page that matches the wide editorial style of the rest of the app (schedule +
match pages). Paste everything inside the block below into Stitch.

---

```
Design an immersive, motion-driven landing / intro page for a web app called
"KICKOFF CARDS". Desktop-first, wide full-bleed layout. Below is the full
product context, the exact brand system, and the animated experience I want.

── THE PRODUCT (so you understand what you're designing) ──
Kickoff Cards is a FREE-TO-PLAY collectible card game built around the FIFA
World Cup 2026 (hosted by USA, Canada & Mexico — the first 48-team World Cup).
The concept: players collect football cards — player cards (Legend / Rare /
Common tiers) and all 48 national-team cards — then before each real World Cup
match they "back" one card. That pick SURVIVES on live real-match data (from a
data feed called TxLINE) or it BURNS if the prediction misses. Whoever holds
the most surviving cards at the final whistle wins their private league. It is
NOT gambling and NOT pay-to-win — it's a free skill + collection game. Sign-in
is a Solana wallet (devnet) which acts as the player's identity. This landing
page is the very first thing a visitor sees; its job is to feel like the
opening titles of a World Cup broadcast, then hand off into the app.

── BRAND & VISUAL SYSTEM (match this exactly) ──
- Signature element: the "World Cup 2026 spectrum" — a bright 100° diagonal
  gradient sweeping purple → pink → orange → green → lime:
  #A435F0 → #E0347A → #FF5A3C → #25C46A → #B6E84A.
  Use it for the wordmark, primary buttons, and thin accent bars ONLY. It is
  the single chromatic hero against an otherwise restrained palette.
- Two coexisting themes (the app uses both, so the landing should bridge them):
  1) Editorial "broadsheet" LIGHT chrome — paper #FFFFFF, ink #000000, hairline
     borders #E5E7EB, muted grey text #5E5D5C. No drop shadows, thin rules,
     generous whitespace, tight negative letter-spacing on big headings.
  2) Cinematic "match-night" DARK theme — near-black #080810 with a faint dotted
     pixel-grid texture, used for the live/immersive moments.
- Typography: "Inter" (weights 400–900) for everything; "Inter Tight" for small
  UPPERCASE tracked eyebrow labels (letter-spacing ~0.2em). Big headlines are
  black-weight (900), condensed feel, tight tracking (-0.03em), e.g. the
  wordmark "Kickoff Cards" stacked on two lines.
- Card visuals: premium gold-framed portrait trading cards (2:3), a flag
  medallion top-left, a small "TEAM"/tier pill top-right, crest or player on a
  team-colour gradient, name across the bottom, and a thin spectrum accent bar.

── THE IMMERSIVE INTRO SEQUENCE (this is the key ask — motion design) ──
Design it as a short cinematic sequence that plays on load, then settles into a
scrollable landing. Storyboard the frames:

1. OPEN ON DARK (#080810): a cinematic full-bleed stage. Iconic World Cup
   "trophy-lift" energy — silhouetted celebration moments / confetti / stadium
   light streaks from the past few World Cups drift and parallax across the
   screen (abstract, no real photos of real people — use stylised silhouettes,
   flares, and confetti in the spectrum colours).
2. MASCOTS COME ALIVE: 2–3 friendly stylised World Cup–style animal mascots
   fly / bounce / dribble a ball across the frame with playful physics, leaving
   faint spectrum-coloured motion trails. Balls arc through the composition.
3. WORDMARK REVEAL: the motion converges and the wordmark "KICKOFF CARDS"
   assembles in the center — big black-weight type, the spectrum gradient
   sweeping through the letters, with a soft glow and a thin spectrum underline
   that draws itself left-to-right. A tiny UPPERCASE eyebrow above reads
   "WORLD CUP · USA · CANADA · MEXICO · 2026".
4. SETTLE: the stage eases from dark into the light editorial layout below; a
   short one-line value prop fades up:
   "Collect cards. Back one before each match. Survive on live World Cup data."
   Primary CTA button (spectrum gradient, white bold text): "Enter Kickoff Cards →"
   Secondary ghost button (hairline border): "Follow the live World Cup".
Include a "Skip intro" affordance and respect reduced-motion (a graceful static
poster frame fallback).

── SCROLLABLE LANDING SECTIONS (below the intro, LIGHT editorial theme) ──
Keep it WIDE and full-bleed like a sports broadsheet, generous margins,
hairline dividers between sections:
A) HERO STRIP: the settled wordmark + value prop + the two CTAs, over a subtle
   host-city skyline line-art watermark washed in the spectrum gradient.
B) "HOW IT PLAYS" — 3 or 4 numbered steps in a clean row, each with a small
   spectrum number chip: (1) Collect your cards · (2) Back a card before
   kickoff · (3) It survives or burns on live data · (4) Most cards at the
   final whistle wins the league.
C) "THE CARDS" — a horizontal, gently auto-scrolling / draggable rail of the
   gold-framed collectible cards: a mix of player cards (Legend gold / Rare
   violet / Common grey tiers) and national-team crest cards. Cards tilt subtly
   on hover with a light glare sweep.
D) "LEAGUES WITH FRIENDS" — a compact editorial block: create or join a private
   league with a 6-character code; small leaderboard preview.
E) FOOTER: thin top rule, muted grey text, a small disclaimer line
   "Free to play · not gambling · World Cup 2026 fan project · TxLINE + Solana
   devnet", and the spectrum bar.

── CONSISTENCY WITH THE REST OF THE APP ──
The landing must feel like the same product as two existing wide pages:
- A SCHEDULE page: a centered vertical list of match fixtures (flags, team
  names, kickoff times, group labels) over a faint full-width host-city line-art
  map watermark, with small soccer balls drifting above it — same light
  editorial broadsheet styling, hairline borders, Inter type.
- A MATCH page: a dark "match-night" live view with a header (flags, live
  score, minute), an odds/momentum chart, an events timeline, and a card the
  user has "backed" that visibly survives or burns.
Reuse the SAME type system, the SAME spectrum accent, the SAME hairline-border
editorial cards, and the SAME gold trading-card look so all screens read as one
design language.

── DELIVERABLES ──
Desktop layout (and a responsive mobile version). Show: (1) the intro sequence
storyboard frames, (2) the settled landing with all sections, (3) hover/motion
states. Emphasize motion: entrance animations, parallax, the wordmark gradient
reveal, mascot flight paths, and the card rail. Keep it premium, high-contrast,
FIFA-Ultimate-Team-meets-editorial-broadsheet — celebratory but clean.
```

---

## Notes for tweaking

- **Swap the intro flavour:** if you want it mascot-led rather than trophy-led,
  move step 2 (mascots) before step 1 (trophy-lift), or drop one entirely.
- **Colours are locked** to the real app spectrum, so whatever Stitch returns
  will already match `--wc-spectrum` in `index.css`.
- **Two themes on purpose:** the intro is dark (match-night), the landing body
  is light (broadsheet) — that mirrors how the app switches between the Live
  match view and the rest of the pages.
- After Stitch generates it, we can port the motion (entrance, wordmark reveal,
  card rail) into `Onboarding.jsx` with framer-motion, which is already in the
  project.
```
