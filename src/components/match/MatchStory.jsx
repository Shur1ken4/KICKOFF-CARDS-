import { useRef, useState } from "react";
import { withAlpha } from "../../data/teams.js";
import { EVENT_ICON, signed } from "../../lib/format.js";

// Build the narrative: top turning points (by win-prob swing) + biggest momentum
// swing across the match.
function buildStory(events, series, homeName) {
  const sorted = [...series].sort((a, b) => a.minute - b.minute);
  const homeAt = (minute) => {
    let v = sorted[0]?.home ?? 50;
    for (const p of sorted) if (p.minute <= minute) v = p.home;
    return v;
  };
  const homeBefore = (minute) => {
    let v = sorted[0]?.home ?? 50;
    for (const p of sorted) if (p.minute < minute) v = p.home;
    return v;
  };

  const turning = events
    .filter((e) => e.type === "goal" || e.type === "red")
    .map((e) => {
      const before = homeBefore(e.minute);
      const after = homeAt(e.minute);
      const isHome = e.team === homeName;
      const teamShift = isHome ? after - before : -(after - before);
      return { ...e, shift: teamShift, magnitude: Math.abs(after - before) };
    })
    .sort((a, b) => b.magnitude - a.magnitude)
    .slice(0, 3)
    .sort((a, b) => a.minute - b.minute);

  // biggest momentum swing across the whole match
  let min = { v: 101, m: 0 };
  let max = { v: -1, m: 0 };
  for (const p of sorted) {
    if (p.home < min.v) min = { v: p.home, m: p.minute };
    if (p.home > max.v) max = { v: p.home, m: p.minute };
  }
  const swingPts = Math.round(max.v - min.v);
  const swingMins = Math.abs(max.m - min.m);

  return { turning, swingPts, swingMins };
}

export default function MatchStory({ meta, teams, score, events, oddsSeries }) {
  const cardRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const { turning, swingPts, swingMins } = buildStory(events, oddsSeries, meta.home);

  const download = async () => {
    if (!cardRef.current) return;
    setBusy(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = `kickoff-cards-${meta.home}-${meta.away}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="eyebrow">Match Story</span>
        <button
          onClick={download}
          disabled={busy}
          className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/20 disabled:opacity-60"
        >
          {busy ? "Rendering…" : "Save shareable card"}
        </button>
      </div>

      <div
        ref={cardRef}
        className="overflow-hidden rounded-2xl border border-canvas p-5"
        style={{
          background: `linear-gradient(135deg, ${withAlpha(teams.home.primary, 0.14)} 0%, rgba(255,255,255,0.97) 45%, ${withAlpha(
            teams.away.primary,
            0.14
          )} 100%)`,
          backgroundColor: "#FFFFFF",
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-widest text-graphite">
            Kickoff Cards
          </span>
          <span className="text-[11px] font-medium uppercase tracking-wide text-primary">
            Match Story
          </span>
        </div>

        <div className="tnum mt-3 flex items-center justify-center gap-3 text-2xl font-extrabold sm:text-3xl">
          <span style={{ color: teams.home.primary }}>
            {teams.home.flag} {meta.home}
          </span>
          <span className="text-ink">
            {score.home}–{score.away}
          </span>
          <span style={{ color: teams.away.primary }}>
            {meta.away} {teams.away.flag}
          </span>
        </div>

        <div className="mt-5">
          <div className="eyebrow mb-2">Turning Points</div>
          <ul className="flex flex-col gap-2">
            {turning.map((t) => (
              <li
                key={t.id}
                className="flex items-center gap-3 rounded-xl border border-canvas bg-paper px-3 py-2"
              >
                <span aria-hidden="true">{EVENT_ICON[t.type]}</span>
                <span className="tnum text-sm font-semibold text-graphite">{t.minute}'</span>
                <span className="flex-1 truncate text-sm font-semibold text-ink">
                  {t.player}
                </span>
                <span
                  className={`tnum text-sm font-bold ${t.shift >= 0 ? "text-primary" : "text-danger"}`}
                >
                  Win prob {signed(t.shift, 0)}%
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl border border-goal/40 bg-goal/10 px-4 py-3">
          <span className="text-sm font-semibold text-ink">Biggest momentum swing</span>
          <span className="tnum text-lg font-extrabold" style={{ color: "#B8860B" }}>
            {swingPts}% in {swingMins} min
          </span>
        </div>
      </div>
    </div>
  );
}
