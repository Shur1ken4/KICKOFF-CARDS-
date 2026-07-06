import StatusBadge from "../common/StatusBadge.jsx";
import { withAlpha } from "../../data/teams.js";

export default function MatchHeader({ meta, teams, score, minute, status }) {
  const home = teams.home;
  const away = teams.away;

  return (
    <div className="card-light relative overflow-hidden">
      {/* dynamic split gradient — home colour left, away colour right */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(100deg, ${withAlpha(home.primary, 0.18)} 0%, ${withAlpha(
            home.primary,
            0.03
          )} 38%, ${withAlpha(away.primary, 0.03)} 62%, ${withAlpha(away.primary, 0.18)} 100%)`,
        }}
      />

      <div className="relative px-4 py-5 sm:px-6 sm:py-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="eyebrow">{meta?.competition || "World Cup"}</span>
          <StatusBadge status={status} />
        </div>

        <div className="flex items-center justify-between gap-2">
          {/* home */}
          <div className="flex flex-1 flex-col items-center text-center">
            <div className="text-4xl sm:text-5xl" aria-hidden="true">
              {home.flag}
            </div>
            <div
              className="mt-1.5 text-sm font-bold sm:text-base"
              style={{ color: home.primary }}
            >
              {meta?.home}
            </div>
          </div>

          {/* score */}
          <div className="flex flex-col items-center px-2">
            <div className="tnum flex items-center gap-3 text-5xl font-extrabold text-ink sm:text-6xl">
              <span>{score?.home ?? 0}</span>
              <span className="text-graphite">:</span>
              <span>{score?.away ?? 0}</span>
            </div>
            <div className="tnum mt-2 rounded-full bg-canvas px-3 py-1 text-sm font-semibold text-ink">
              {status === "finished" ? "Full Time" : status === "ht" ? "Half Time" : `${minute}'`}
            </div>
          </div>

          {/* away */}
          <div className="flex flex-1 flex-col items-center text-center">
            <div className="text-4xl sm:text-5xl" aria-hidden="true">
              {away.flag}
            </div>
            <div
              className="mt-1.5 text-sm font-bold sm:text-base"
              style={{ color: away.primary }}
            >
              {meta?.away}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
