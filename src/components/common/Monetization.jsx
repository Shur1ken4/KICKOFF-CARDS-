// Kickoff Cards monetization surfaces — 100% informational. The game is free to
// play and never pay-to-win. These components communicate the revenue model
// (optional post-tournament NFT mint, cosmetic packs) with a local "interest"
// state only. No real payment, wallet charge, or token mint ever happens here.

import { useState } from "react";

const FINAL_DATE = new Date("2026-07-19T00:00:00Z");
const INTEREST_KEY = "kc:interest";

function useInterest(id) {
  const [saved, setSaved] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(INTEREST_KEY) || "{}")[id] === true;
    } catch {
      return false;
    }
  });
  const save = () => {
    try {
      const map = JSON.parse(localStorage.getItem(INTEREST_KEY) || "{}");
      map[id] = true;
      localStorage.setItem(INTEREST_KEY, JSON.stringify(map));
    } catch {
      /* storage unavailable */
    }
    setSaved(true);
  };
  return { saved, save };
}

const COSMETIC_PACKS = [
  { id: "starter_boost", name: "Starter Boost", price: "$2.99", desc: "3 extra starter cards + a custom league badge." },
  { id: "card_skin", name: "Card Skin Pack", price: "$1.99", desc: "Alternate art skins for your favourite cards." },
  { id: "animated_story", name: "Animated Story", price: "$0.99", desc: "Turn any Match Story into a shareable animation." },
  { id: "league_badge", name: "League Badge", price: "$1.99", desc: "A custom crest + colours for your league." },
];

const MINT_TIERS = [
  { tier: "Common", price: "$0.50", color: "#9CA3AF" },
  { tier: "Rare", price: "$1.99", color: "#7C6CF0" },
  { tier: "Legend", price: "$4.99", color: "#E4B23C" },
];

// Two editions of the same free-to-play game. The Free edition ships the full
// 48-nation team set plus a limited player roster; Full Squad unlocks the entire
// player catalogue to collect. Cosmetic/collection only — league points come from
// play, so an edition never changes match outcomes or fairness.
const EDITIONS = [
  {
    id: "edition_free",
    name: "Free",
    price: "$0",
    tag: "Play now",
    features: [
      "All 48 national-team cards",
      "A starter set of player cards",
      "Full league + live staking loop",
    ],
  },
  {
    id: "edition_full_squad",
    name: "Full Squad",
    price: "$4.99",
    tag: "Every player",
    highlight: true,
    features: [
      "All 48 national-team cards",
      "The complete player roster to collect",
      "Exclusive card frames & art skins",
    ],
  },
];

export function Editions() {
  return (
    <section>
      <p className="eyebrow mb-1">Two ways to play · optional</p>
      <p className="mb-3 text-[13px] text-graphite">
        Every edition is free to play. Paid editions only widen the cards you can
        collect and show off — never match outcomes or league fairness.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {EDITIONS.map((e) => (
          <EditionCard key={e.id} edition={e} />
        ))}
      </div>
    </section>
  );
}

function EditionCard({ edition }) {
  const { saved, save } = useInterest(edition.id);
  return (
    <div
      className="card-light flex flex-col p-4"
      style={edition.highlight ? { borderColor: "#E4B23C" } : undefined}
    >
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-black text-ink">{edition.name}</span>
        <span className="tnum text-sm font-bold text-ink">{edition.price}</span>
      </div>
      <span
        className={`mt-1 w-fit rounded px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide ${
          edition.highlight ? "text-ink" : "text-graphite"
        }`}
        style={edition.highlight ? { background: "rgba(228,178,60,0.18)" } : { background: "#E5E7EB" }}
      >
        {edition.tag}
      </span>
      <ul className="mt-3 flex-1 space-y-1.5">
        {edition.features.map((f) => (
          <li key={f} className="flex gap-2 text-[12px] text-graphite">
            <span className="text-ink">·</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      {edition.price === "$0" ? (
        <span className="mt-3 rounded-lg border border-canvas bg-canvas/60 py-2 text-center text-[12px] font-bold text-graphite">
          Included — you're playing it
        </span>
      ) : saved ? (
        <span className="mt-3 rounded-lg border border-canvas bg-canvas/60 py-2 text-center text-[12px] font-bold text-graphite">
          On your wishlist ✓
        </span>
      ) : (
        <button
          onClick={save}
          className="mt-3 rounded-lg border border-ink py-2 text-[12px] font-bold text-ink transition hover:bg-canvas"
        >
          Add to wishlist
        </button>
      )}
    </div>
  );
}

export function CosmeticPacks() {
  return (
    <section>
      <p className="eyebrow mb-1">Cosmetic packs · optional</p>
      <p className="mb-3 text-[13px] text-graphite">
        Purely visual. They never affect card points or match outcomes.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {COSMETIC_PACKS.map((p) => (
          <PackCard key={p.id} pack={p} />
        ))}
      </div>
    </section>
  );
}

function PackCard({ pack }) {
  const { saved, save } = useInterest(pack.id);
  return (
    <div className="card-light flex flex-col p-4">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-black text-ink">{pack.name}</span>
        <span className="tnum text-sm font-bold text-ink">{pack.price}</span>
      </div>
      <p className="mt-1 flex-1 text-[12px] text-graphite">{pack.desc}</p>
      {saved ? (
        <span className="mt-3 rounded-lg border border-canvas bg-canvas/60 py-2 text-center text-[12px] font-bold text-graphite">
          On your wishlist ✓
        </span>
      ) : (
        <button
          onClick={save}
          className="mt-3 rounded-lg border border-ink py-2 text-[12px] font-bold text-ink transition hover:bg-canvas"
        >
          Add to wishlist
        </button>
      )}
    </div>
  );
}

// Optional NFT mint of your collection — only available AFTER the final, and only
// ever initiated by you in your own wallet. This surface is informational.
export function NftMint() {
  const open = new Date() >= FINAL_DATE;
  return (
    <section>
      <div className="wc-hero rounded-xl p-5 text-paper">
        <div className="flex items-center justify-between">
          <span className="eyebrow !text-paper/85">Mint your collection</span>
          <span className="rounded bg-paper/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
            After the final
          </span>
        </div>
        <p className="mt-2 text-[13px] text-paper/85">
          When the tournament ends, you can optionally mint your surviving cards as
          keepsake NFTs on Solana. Totally optional — your cards and league result
          never depend on it.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {MINT_TIERS.map((m) => (
            <div key={m.tier} className="rounded-lg bg-paper/15 px-2 py-2 text-center">
              <div className="text-[11px] font-bold uppercase tracking-wide" style={{ color: "#fff" }}>
                {m.tier}
              </div>
              <div className="tnum text-sm font-black">{m.price}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-lg bg-paper/20 py-2.5 text-center text-[12px] font-bold">
          {open ? "Minting opens in your wallet — you sign every mint" : "Minting opens after the final · Jul 19, 2026"}
        </div>
      </div>
      <p className="mt-2 text-center text-[11px] text-graphite">
        Kickoff Cards never mints, sells, or charges on your behalf. You initiate and
        sign any mint yourself.
      </p>
    </section>
  );
}

export function LeagueUpsell() {
  const { saved, save } = useInterest("league_badge");
  return (
    <div className="card-light flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="eyebrow wc-text-gradient">Make it yours</p>
        <p className="mt-1 text-[13px] text-graphite">
          Custom league crest, colours & card skins · <span className="font-bold text-ink">from $1.99</span> · cosmetic only
        </p>
      </div>
      {saved ? (
        <span className="shrink-0 rounded-lg border border-canvas bg-canvas px-3 py-2 text-center text-[12px] font-bold text-ink">
          On your wishlist ✓
        </span>
      ) : (
        <button onClick={save} className="btn-gradient shrink-0 px-4 py-2.5 text-[13px]">
          Browse cosmetics →
        </button>
      )}
    </div>
  );
}
