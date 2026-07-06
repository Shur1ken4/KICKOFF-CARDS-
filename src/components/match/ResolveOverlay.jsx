// Full-screen resolution moment. When a match finishes and staked cards resolve,
// this overlays the result: a celebratory firework + confetti burst when any call
// lands (showing the earned bonus cards), or a somber ember/ash fall when calls
// burn. Auto-dismisses; also closes on click. Honours prefers-reduced-motion.

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "../cards/Card.jsx";
import { cardDisplay } from "../../lib/cards.js";

const CONFETTI_COLORS = ["#A435F0", "#E0347A", "#FF5A3C", "#25C46A", "#B6E84A", "#FFD700"];

const rand = (min, max) => min + Math.random() * (max - min);

// Confetti rain — pieces fall from the top with drift + spin.
function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 46 }).map((_, i) => ({
        id: i,
        left: rand(0, 100),
        size: rand(6, 12),
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        delay: rand(0, 0.6),
        duration: rand(1.6, 2.8),
        drift: rand(-60, 60),
        rot: rand(180, 720),
        round: Math.random() > 0.6,
      })),
    []
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute top-[-24px]"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.round ? "9999px" : "2px",
          }}
          initial={{ y: -24, x: 0, opacity: 1, rotate: 0 }}
          animate={{ y: "104vh", x: p.drift, opacity: [1, 1, 0.9, 0], rotate: p.rot }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}

// Radial firework bursts at a few origins.
function Fireworks() {
  const bursts = useMemo(
    () =>
      Array.from({ length: 3 }).map((_, b) => ({
        id: b,
        cx: rand(22, 78),
        cy: rand(18, 46),
        delay: b * 0.5,
        color: CONFETTI_COLORS[(b * 2) % CONFETTI_COLORS.length],
        sparks: Array.from({ length: 14 }).map((__, s) => ({
          id: s,
          angle: (s / 14) * Math.PI * 2,
          dist: rand(60, 120),
        })),
      })),
    []
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {bursts.map((burst) => (
        <div
          key={burst.id}
          className="absolute"
          style={{ left: `${burst.cx}%`, top: `${burst.cy}%` }}
        >
          {burst.sparks.map((sp) => (
            <motion.span
              key={sp.id}
              className="absolute h-1.5 w-1.5 rounded-full"
              style={{ background: burst.color, boxShadow: `0 0 6px ${burst.color}` }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos(sp.angle) * sp.dist,
                y: Math.sin(sp.angle) * sp.dist,
                opacity: [1, 1, 0],
                scale: [1, 1, 0.4],
              }}
              transition={{ duration: 1.1, delay: burst.delay, ease: "easeOut", repeat: 1, repeatDelay: 0.4 }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// Embers/ash drifting down for a burn result.
function Embers() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        left: rand(0, 100),
        size: rand(3, 7),
        delay: rand(0, 1),
        duration: rand(2.2, 3.6),
        drift: rand(-40, 40),
        color: i % 3 === 0 ? "#FF5A3C" : i % 3 === 1 ? "#9CA3AF" : "#5E5D5C",
      })),
    []
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute top-[-16px] rounded-full"
          style={{ left: `${p.left}%`, width: p.size, height: p.size, background: p.color }}
          initial={{ y: -16, opacity: 0.9 }}
          animate={{ y: "104vh", x: p.drift, opacity: [0.9, 0.7, 0] }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}

export default function ResolveOverlay({ outcomes, onClose }) {
  const won = outcomes.filter((o) => o.won);
  const lost = outcomes.filter((o) => !o.won);
  const anyWon = won.length > 0;
  const allWon = lost.length === 0;

  const title = allWon
    ? "Every call landed!"
    : anyWon
      ? `${won.length} landed · ${lost.length} burned`
      : lost.length > 1
        ? "Your cards burned 🔥"
        : "Your card burned 🔥";

  const subtitle = anyWon
    ? `+${won.length} bonus ${won.length === 1 ? "card" : "cards"} added to your collection`
    : "Backed cards that miss are gone for good";

  // Cards to showcase: earned rewards on a win, the burned cards otherwise.
  const showcase = anyWon
    ? won.map((o) => ({ card: o.reward, state: "won", key: o.reward.key }))
    : lost.map((o) => ({ card: o.card, state: "burning", key: o.cardKey }));

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          background: anyWon
            ? "radial-gradient(circle at 50% 30%, rgba(255,255,255,0.6), rgba(0,0,0,0.55) 70%)"
            : "radial-gradient(circle at 50% 40%, rgba(40,20,10,0.5), rgba(0,0,0,0.7) 75%)",
          backdropFilter: "blur(2px)",
        }}
      >
        {anyWon ? (
          <>
            <Confetti />
            <Fireworks />
          </>
        ) : (
          <Embers />
        )}

        <motion.div
          className="relative z-10 w-full max-w-md rounded-card border border-canvas bg-paper p-6 text-center shadow-2xl"
          initial={{ scale: 0.85, y: 24, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.05 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-4xl" aria-hidden="true">
            {anyWon ? "🎉" : "😔"}
          </div>
          <h2 className="mt-2 text-xl font-black tracking-tight text-ink">{title}</h2>
          <p className="mt-1 text-sm text-graphite">{subtitle}</p>

          {anyWon
            ? (
                <>
                  <div className="mt-5 overflow-hidden rounded-2xl border border-canvas bg-black">
                    <img
                      src="/win-celebration.gif"
                      alt="Celebration"
                      className="mx-auto max-h-52 w-full object-contain"
                    />
                  </div>
                  {showcase.length > 0 && (
                    <div className="mt-4 flex flex-wrap items-end justify-center gap-3">
                      {showcase.slice(0, 3).map((s) => (
                        <div key={s.key} className="w-20 sm:w-24">
                          <Card {...cardDisplay(s.card)} state={s.state} disabled />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )
            : (
                <div className="mt-5 overflow-hidden rounded-2xl border border-canvas bg-black">
                  <video
                    className="h-full w-full"
                    src="/no-pressure.mp4"
                    autoPlay
                    playsInline
                    controls
                  />
                </div>
              )}

          <button
            onClick={onClose}
            className="btn-gradient mt-6 w-full px-4 py-2.5 text-sm"
          >
            Continue
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
