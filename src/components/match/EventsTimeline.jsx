import { EVENT_ICON } from "../../lib/format.js";
import { getTeam, withAlpha } from "../../data/teams.js";

const TYPE_LABEL = {
  goal: "Goal",
  red: "Red Card",
  yellow: "Yellow Card",
  sub: "Substitution",
  event: "Event",
};

function EventRow({ event, isNewest }) {
  const team = getTeam(event.team);
  const accent =
    event.type === "goal"
      ? "#FFB800"
      : event.type === "red"
        ? "#FF4444"
        : event.type === "yellow"
          ? "#E6C200"
          : team.primary;

  return (
    <li
      className={`flex gap-3 rounded-xl border border-canvas bg-paper p-3 ${
        isNewest ? "animate-slideInTop" : ""
      }`}
      style={{ borderLeft: `3px solid ${accent}` }}
    >
      <div
        className="tnum flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold"
        style={{ background: withAlpha(accent, 0.15), color: accent }}
      >
        {event.minute}'
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span aria-hidden="true">{EVENT_ICON[event.type] || "•"}</span>
          <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: accent }}>
            {TYPE_LABEL[event.type] || "Event"}
          </span>
          <span className="ml-auto flex items-center gap-1 text-xs text-graphite">
            <span aria-hidden="true">{team.flag}</span>
            {event.team}
          </span>
        </div>
        <div className="mt-0.5 truncate text-sm font-semibold text-ink">
          {event.player}
        </div>
        {event.detail && (
          <div className="mt-0.5 truncate text-xs text-graphite">{event.detail}</div>
        )}
      </div>
    </li>
  );
}

export default function EventsTimeline({ events = [], newestId }) {
  const ordered = [...events].sort((a, b) => b.minute - a.minute);

  return (
    <div className="card-light flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-canvas px-4 py-3">
        <span className="eyebrow">Match Timeline</span>
        <span className="tnum text-xs text-graphite">{events.length} events</span>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {ordered.length === 0 ? (
          <div className="flex h-full min-h-[160px] flex-col items-center justify-center gap-2 text-center text-graphite">
            <span className="text-2xl" aria-hidden="true">
              ⏱️
            </span>
            <p className="text-sm">Kick-off awaited. Events appear here live.</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {ordered.map((e) => (
              <EventRow key={e.id} event={e} isNewest={e.id === newestId} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
