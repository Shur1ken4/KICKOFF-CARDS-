import { getTeam, withAlpha } from "../../data/teams.js";
import { fmtPct1, signed } from "../../lib/format.js";
import { pointsForWallet } from "../../lib/predictions.js";

const ROW_H = 84; // px, including gap

const MEDAL = {
  1: { color: "#FFD700", glow: "rgba(255,215,0,0.25)" },
  2: { color: "#C0C0C0", glow: "rgba(192,192,192,0.2)" },
  3: { color: "#CD7F32", glow: "rgba(205,127,50,0.2)" },
};

function Row({ row, isMe, leagueId }) {
  const topTeam = row.teams[0];
  const accent = getTeam(topTeam).primary;
  const medal = MEDAL[row.rank];
  const predPts = pointsForWallet(row.id, leagueId);

  return (
    <div
      className="absolute inset-x-0 transition-all duration-[600ms] [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]"
      style={{ transform: `translateY(${(row.rank - 1) * ROW_H}px)`, height: ROW_H - 12 }}
    >
      <div
        className="flex h-full items-center gap-3 rounded-xl border bg-paper px-3 sm:px-4"
        style={{
          borderColor: isMe ? "#000000" : "#E5E7EB",
          borderLeft: `4px solid ${accent}`,
        }}
      >
        {/* rank */}
        <div
          className="tnum flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black"
          style={{
            color: medal ? "#000000" : "#5E5D5C",
            background: medal ? medal.glow : "#E5E7EB",
          }}
        >
          {row.rank}
        </div>

        {/* identity + teams */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-bold text-ink">{row.name}</span>
            {isMe && (
              <span className="rounded bg-ink px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-paper">
                You
              </span>
            )}
            {predPts > 0 && (
              <span
                className="tnum shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-paper"
                style={{ background: "var(--wc-spectrum)" }}
                title="Bonus points from live predictions"
              >
                +{predPts} pred
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {row.teamValues.map((tv) => (
              <span
                key={tv.team}
                className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium"
                style={{
                  background: withAlpha(getTeam(tv.team).primary, 0.14),
                  color: getTeam(tv.team).primary,
                }}
                title={`${tv.team} ${fmtPct1(tv.value)}`}
              >
                <span aria-hidden="true">{getTeam(tv.team).flag}</span>
                <span className="hidden sm:inline">{tv.team}</span>
              </span>
            ))}
          </div>
        </div>

        {/* portfolio value */}
        <div className="shrink-0 text-right">
          <div className="tnum text-lg font-black text-ink">
            {fmtPct1(row.value)}
          </div>
          <div
            className={`tnum text-[11px] font-bold ${
              row.delta >= 0 ? "text-ink" : "text-danger"
            }`}
          >
            {signed(row.delta)} today
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Leaderboard({ rows, meId, leagueId }) {
  return (
    <div className="card-light p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="eyebrow">Live Leaderboard</span>
        <span className="text-[11px] text-graphite">Portfolio value · updates live</span>
      </div>
      <div className="relative" style={{ height: rows.length * ROW_H }}>
        {rows.map((row) => (
          <Row
            key={row.id}
            row={row}
            isMe={row.id === meId}
            leagueId={leagueId}
          />
        ))}
      </div>
    </div>
  );
}
