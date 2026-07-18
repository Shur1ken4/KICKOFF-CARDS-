// Kickoff Cards — keepsake mint animation. A purely visual preview of the
// optional post-final NFT mint: choose a finish, tap "Mint", watch the card
// charge up on the World Cup spectrum, then flip-reveal into a premium tier
// card with a sparkle burst (Legend earns the gold shimmer sweep).
//
// Nothing real happens here — no wallet debit, no token mint, no network call.
// It exists to *show* how minting will feel, so the disclaimer stays truthful.

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LEGENDS, RARES, COMMONS } from "../../data/players.js";
import { teamFlag } from "../../data/worldcup2026.js";

const SPECTRUM =
  "linear-gradient(100deg, #a435f0, #e0347a, #ff5a3c, #25c46a, #b6e84a)";

// Each finish draws from its own tier pool — minting reveals a *random* card from
// that pool, which is the whole hook: you never know which star you'll pull, so
// there's always a reason to mint again. `points` mirrors the tier value in
// players.js (legend 30 / rare 15 / common 6).
const TIERS = [
  { key: "Common", color: "#9CA3AF", price: "0.50 USDC", pool: COMMONS, points: 6 },
  { key: "Rare", color: "#7C6CF0", price: "1.99 USDC", pool: RARES, points: 15 },
  { key: "Legend", color: "#E4B23C", price: "4.99 USDC", pool: LEGENDS, points: 30 },
];

// A player -> the card object the reveal renders. `image` is the real full-bleed
// collectible art (public/cards/<id>.png); if it fails to load we fall back to the
// drawn flag face below.
const toCard = (p) => ({
  name: p.name,
  team: p.team,
  flag: teamFlag(p.team),
  image: `/cards/${p.id}.png`,
});

const pickRandom = (pool) => pool[Math.floor(Math.random() * pool.length)];

// Deterministic radial burst so the reveal always sparkles the same way.
const SPARKS = Array.from({ length: 14 }, (_, i) => {
  const angle = (i / 14) * Math.PI * 2;
  const dist = 78 + (i % 3) * 22;
  return {
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist,
    glyph: i % 3 === 0 ? "✨" : "•",
    delay: 0.12 + (i % 5) * 0.03,
  };
});

export default function MintCard({ onTierChange }) {
  const [phase, setPhase] = useState("idle"); // idle | minting | revealed
  const [tier, setTier] = useState(TIERS[2]);
  const [card, setCard] = useState(() => toCard(pickRandom(TIERS[2].pool)));
  const [imgFailed, setImgFailed] = useState(false);
  const isLegend = tier.key === "Legend";
  const busy = phase === "minting";
  const showImage = Boolean(card.image) && !imgFailed;

  // Let a parent (the dark mint band) tint its glow to the chosen finish.
  const pickTier = (t) => {
    setTier(t);
    onTierChange?.(t.color);
  };

  const mint = () => {
    // The reveal is a *random* pull from the chosen tier's pool — this is what
    // makes each mint feel like opening a pack.
    setCard(toCard(pickRandom(tier.pool)));
    setImgFailed(false);
    setPhase("minting");
    setTimeout(() => setPhase("revealed"), 1900);
  };
  const reset = () => setPhase("idle");

  return (
    <div className="flex flex-col items-center">
      {/* finish picker — idle only */}
      <AnimatePresence initial={false}>
        {phase === "idle" && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mb-4 flex gap-2"
          >
            {TIERS.map((t) => {
              const active = t.key === tier.key;
              return (
                <button
                  key={t.key}
                  onClick={() => pickTier(t)}
                  className="rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wide transition"
                  style={
                    active
                      ? { background: "#fff", color: "#1c1c1b" }
                      : {
                          background: "rgba(255,255,255,0.15)",
                          color: "#fff",
                          boxShadow: `inset 0 0 0 1px ${t.color}`,
                        }
                  }
                >
                  {t.key}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* stage */}
      <div
        className="relative flex h-[292px] w-[220px] items-center justify-center"
        style={{ perspective: 1100 }}
      >
        {/* spinning charge ring while minting */}
        <AnimatePresence>
          {busy && (
            <motion.div
              key="ring"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 0.85, scale: 1, rotate: 360 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{
                rotate: { duration: 1.1, repeat: Infinity, ease: "linear" },
                opacity: { duration: 0.3 },
                scale: { duration: 0.3 },
              }}
              className="absolute h-[250px] w-[250px] rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent, #a435f0, #e0347a, #ff5a3c, #25c46a, #b6e84a, transparent)",
                filter: "blur(9px)",
              }}
            />
          )}
        </AnimatePresence>

        {/* sparkle burst on reveal */}
        <AnimatePresence>
          {phase === "revealed" &&
            SPARKS.map((s, i) => (
              <motion.span
                key={`spark-${i}`}
                className="pointer-events-none absolute text-[13px] font-black"
                style={{ color: isLegend ? "#E4B23C" : tier.color }}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                animate={{
                  x: s.x,
                  y: s.y,
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0.5],
                }}
                transition={{ duration: 0.85, delay: s.delay, ease: "easeOut" }}
              >
                {s.glyph}
              </motion.span>
            ))}
        </AnimatePresence>

        {/* the flip card */}
        <motion.div
          className="relative h-[270px] w-[180px]"
          style={{ transformStyle: "preserve-3d" }}
          animate={{
            rotateY: phase === "revealed" ? 180 : 0,
            scale: busy ? [1, 1.05, 1] : 1,
            y: phase === "idle" ? [0, -6, 0] : 0,
          }}
          transition={{
            rotateY: { duration: 0.9, ease: [0.34, 1.56, 0.64, 1] },
            scale: busy
              ? { duration: 0.75, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.3 },
            y:
              phase === "idle"
                ? { duration: 3, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.3 },
          }}
        >
          {/* ---- BACK (sealed pack) ---- */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-between overflow-hidden rounded-card p-4 text-center text-paper"
            style={{ backfaceVisibility: "hidden", background: SPECTRUM }}
          >
            {/* holo sheen */}
            <motion.div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.55) 50%, transparent 65%)",
                backgroundSize: "250% 250%",
              }}
              animate={{ backgroundPosition: ["-120% 0", "120% 0"] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
            />
            <span className="relative text-[10px] font-black uppercase tracking-[0.22em]">
              Kickoff Cards
            </span>
            <span className="relative text-5xl drop-shadow-md" aria-hidden="true">
              {busy ? "⚡" : "⚽"}
            </span>
            <span className="relative text-[10px] font-bold uppercase tracking-[0.18em] text-paper/85">
              {busy ? "Minting…" : "Keepsake NFT"}
            </span>
          </div>

          {/* ---- FRONT (premium reveal) ---- */}
          <div
            className={`absolute inset-0 flex flex-col overflow-hidden rounded-card border-2 bg-paper ${
              isLegend && !showImage ? "kc-shimmer" : ""
            }`}
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              borderColor: showImage ? "transparent" : tier.color,
              boxShadow: `0 0 0 4px ${tier.color}44`,
            }}
          >
            {showImage ? (
              <>
                {/* real collectible art (photo + flag + name baked in) */}
                <img
                  src={card.image}
                  alt={card.name}
                  draggable={false}
                  onError={() => setImgFailed(true)}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {/* Legend gold shimmer sweep, layered over the art */}
                {isLegend && (
                  <span className="kc-shimmer pointer-events-none absolute inset-0" />
                )}
                {/* authenticity stamp — top-centre, clear of the flag/position */}
                <motion.div
                  initial={{ scale: 0, rotate: -18, opacity: 0 }}
                  animate={{ scale: 1, rotate: -8, opacity: 1 }}
                  transition={{ delay: 0.55, type: "spring", stiffness: 320, damping: 14 }}
                  className="absolute left-1/2 top-3 flex -translate-x-1/2 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-paper backdrop-blur-sm"
                  style={{ background: `${tier.color}E6`, boxShadow: `0 2px 8px ${tier.color}66` }}
                >
                  <span>Minted</span>
                  <span aria-hidden="true">✓</span>
                </motion.div>
              </>
            ) : (
              <>
                {/* accent band */}
                <div
                  className="h-1.5 w-full shrink-0"
                  style={{
                    background: `linear-gradient(90deg, ${tier.color}, ${tier.color}55)`,
                  }}
                />
                <div className="flex flex-1 flex-col p-3">
                  <div className="flex items-center justify-between">
                    <span
                      className="rounded px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest"
                      style={{ background: `${tier.color}28`, color: tier.color }}
                    >
                      {tier.key}
                    </span>
                    <span className="tnum text-[10px] font-bold text-graphite">
                      {tier.points} pts
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-center text-5xl" aria-hidden="true">
                    {card.flag}
                  </div>

                  <div className="mt-auto">
                    <div className="truncate text-[13px] font-black leading-tight text-ink">
                      {card.name}
                    </div>
                    <div className="truncate text-[10px] font-medium text-graphite">
                      {card.team}
                    </div>
                  </div>

                  {/* minted stamp */}
                  <div
                    className="mt-2 flex items-center justify-center gap-1 rounded-md py-1 text-[10px] font-black uppercase tracking-wide text-paper"
                    style={{ background: tier.color }}
                  >
                    <span>Minted</span>
                    <span aria-hidden="true">✓</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* controls */}
      <div className="mt-5 flex min-h-[64px] w-full flex-col items-center">
        <AnimatePresence mode="wait">
          {phase === "idle" && (
            <motion.div
              key="c-idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <button
                onClick={mint}
                className="btn-gradient px-5 py-2.5 text-[13px]"
              >
                Mint {tier.key} card · {tier.price} →
              </button>
              <span
                className="mt-2 flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold text-paper"
                style={{ background: `${tier.color}33`, boxShadow: `inset 0 0 0 1px ${tier.color}66` }}
              >
                <span aria-hidden="true">🎲</span>
                Random {tier.key} pull — you never know who you'll get
              </span>
              <span className="mt-1.5 text-[11px] text-paper/70">
                Preview only — no charge, no wallet debit
              </span>
            </motion.div>
          )}

          {busy && (
            <motion.div
              key="c-busy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-[13px] font-bold text-paper"
            >
              <span>Writing to Solana</span>
              <span className="flex gap-1">
                {[0, 1, 2].map((d) => (
                  <motion.span
                    key={d}
                    className="inline-block h-1.5 w-1.5 rounded-full bg-paper"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 0.9,
                      repeat: Infinity,
                      delay: d * 0.18,
                    }}
                  />
                ))}
              </span>
            </motion.div>
          )}

          {phase === "revealed" && (
            <motion.div
              key="c-done"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <span className="text-[13px] font-black text-paper">
                You pulled{" "}
                <span style={{ color: isLegend ? "#F0C864" : tier.color }}>
                  {card.name}
                </span>
                !
              </span>
              <span className="tnum mt-0.5 text-[11px] font-semibold text-paper/70">
                Signed by you · 3Qk9…Ftx2
              </span>
              <button
                onClick={reset}
                className="mt-2 rounded-full border border-paper/40 px-4 py-1.5 text-[12px] font-bold text-paper transition hover:bg-paper/10"
              >
                Mint another
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
