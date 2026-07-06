import { getTeam, withAlpha } from "../../data/teams.js";
import { EVENT_ICON, signed } from "../../lib/format.js";

const HEADLINE = {
  goal: "TURNING POINT",
  red: "GAME CHANGER",
  yellow: "FLASHPOINT",
  sub: "TACTICAL SHIFT",
};

export default function MomentCard({ moment }) {
  if (!moment) return null;
  const { event, insight, loading } = moment;
  const team = getTeam(event.team);
  const before = moment.oddsBefore;
  const after = moment.oddsAfter;
  const delta = after - before;

  return (
    <div
      className="animate-slideDown overflow-hidden rounded-2xl border shadow-lg"
      style={{
        borderColor: withAlpha(team.primary, 0.4),
        background: `linear-gradient(135deg, ${withAlpha(team.primary, 0.16)} 0%, ${withAlpha(
          team.primary,
          0.04
        )} 55%, rgba(255,255,255,0.96) 100%)`,
        backgroundColor: "#FFFFFF",
      }}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">
            {EVENT_ICON[event.type] || "•"}
          </span>
          <span className="text-sm font-bold uppercase tracking-wider" style={{ color: team.primary }}>
            {event.type === "goal" ? "GOAL" : event.type === "red" ? "RED CARD" : event.type}
          </span>
          <span className="tnum text-sm font-bold text-ink">— {event.minute}'</span>
          <span className="ml-auto rounded-full bg-canvas px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-graphite">
            {HEADLINE[event.type] || "MOMENT"}
          </span>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: team.primary }}>
            <span aria-hidden="true">{team.flag}</span>
            {event.team} win probability
          </span>
        </div>
        <div className="tnum mt-1 flex items-center gap-2 text-2xl font-extrabold">
          <span className="text-graphite">{before}%</span>
          <span aria-hidden="true" style={{ color: team.primary }}>
            →
          </span>
          <span style={{ color: team.primary }}>{after}%</span>
          <span
            className={`ml-1 rounded-md px-2 py-0.5 text-sm font-bold ${
              delta >= 0 ? "text-primary" : "text-danger"
            }`}
            style={{ background: withAlpha(delta >= 0 ? "#25C46A" : "#FF4444", 0.12) }}
          >
            {signed(delta, 0)}
          </span>
        </div>

        <p className="mt-3 text-[15px] leading-relaxed text-ink">
          {loading ? (
            <span className="inline-flex items-center gap-2 text-graphite">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              Reading the moment…
            </span>
          ) : (
            insight
          )}
        </p>
        <div className="mt-2 text-[10px] font-medium uppercase tracking-widest text-graphite">
          AI Moment Insight
        </div>
      </div>
    </div>
  );
}
