// Kickoff Cards — the collectible card face. White base, country-colour accent,
// tier-coloured border, Legend shimmer. Used everywhere cards appear: staking,
// collection, match story. Framer Motion drives the win (pop + glow) and burn
// (scorch + fall away) states used when a backed call resolves.

import { useState } from "react";
import { motion } from "framer-motion";
import { tierMeta } from "../../data/players.js";
import { withAlpha } from "../../data/worldcup2026.js";

const TIER_LABEL = { legend: "Legend", rare: "Rare", common: "Common", team: "Team" };

// state: "idle" | "selected" | "won" | "burning"
export default function Card({
  tier = "common",
  title,
  subtitle,
  flag,
  accent = "#111827",
  points,
  image,
  state = "idle",
  onClick,
  disabled = false,
  className = "",
}) {
  const isTeam = tier === "team";
  const meta = isTeam ? null : tierMeta(tier);
  const border = isTeam ? accent : meta.color;
  const glow = isTeam ? withAlpha(accent, 0.4) : meta.glow;
  const isLegend = tier === "legend";

  // Full-bleed card art (public/cards/<id>.png). The frame, flag, position and
  // name are baked into the artwork, so when it loads we hide the drawn face.
  // A missing/broken image falls back to the HTML card via onError.
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = Boolean(image) && !imgFailed;

  const variants = {
    idle: { scale: 1, opacity: 1, rotate: 0, filter: "brightness(1)" },
    selected: { scale: 1.03, opacity: 1, rotate: 0 },
    won: {
      scale: [1, 1.12, 1],
      opacity: 1,
      filter: ["brightness(1)", "brightness(1.4)", "brightness(1)"],
      transition: { duration: 0.7 },
    },
    burning: {
      opacity: [1, 1, 0],
      y: [0, 6, 40],
      rotate: [0, -3, -8],
      filter: [
        "brightness(1) saturate(1)",
        "brightness(0.6) saturate(0.4) sepia(0.6)",
        "brightness(0.2) saturate(0) sepia(1)",
      ],
      transition: { duration: 1.1, times: [0, 0.4, 1] },
    },
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      animate={state}
      variants={variants}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      className={`kc-card ${isLegend && !showImage ? "kc-shimmer" : ""} text-left ${
        state === "selected" ? "ring-2 ring-offset-2" : ""
      } ${disabled ? "cursor-default" : ""} ${className}`}
      style={{
        borderColor: showImage ? "transparent" : border,
        boxShadow: state === "selected" || state === "won" ? `0 0 0 4px ${glow}` : undefined,
        "--tw-ring-color": border,
      }}
    >
      {/* burning overlay */}
      {state === "burning" && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0] }}
          transition={{ duration: 1.1 }}
          style={{
            background:
              "radial-gradient(circle at 50% 100%, rgba(255,120,20,0.9), rgba(255,60,0,0.5) 40%, transparent 72%)",
          }}
        />
      )}

      {showImage ? (
        <img
          src={image}
          alt={title}
          draggable={false}
          onError={() => setImgFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <>
          {/* country-colour accent band */}
          <div
            className="h-1.5 w-full shrink-0"
            style={{ background: `linear-gradient(90deg, ${accent}, ${withAlpha(accent, 0.35)})` }}
          />

          <div className="flex flex-1 flex-col p-3">
            <div className="flex items-center justify-between">
              <span
                className="rounded px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest"
                style={{ background: withAlpha(border, 0.16), color: border }}
              >
                {TIER_LABEL[tier] || tier}
              </span>
              {points != null && (
                <span className="tnum text-[10px] font-bold text-graphite">{points} pts</span>
              )}
            </div>

            <div className="mt-2 flex items-center justify-center text-4xl" aria-hidden="true">
              {flag}
            </div>

            <div className="mt-auto">
              <div className="truncate text-[13px] font-black leading-tight text-ink">{title}</div>
              {subtitle && (
                <div className="truncate text-[10px] font-medium text-graphite">{subtitle}</div>
              )}
            </div>
          </div>
        </>
      )}
    </motion.button>
  );
}
