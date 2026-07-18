import StatusBadge from "../common/StatusBadge.jsx";
import StadiumBackdrop from "../common/StadiumBackdrop.jsx";
import { withAlpha } from "../../data/teams.js";

export default function MatchHeader({ meta, teams, score, minute, status }) {
  const home = teams.home;
  const away = teams.away;

  return (
    <div className="card-light relative overflow-hidden">
      {/* rotating stadium photos behind the banner (lighter scrim = more visible) */}
      <StadiumBackdrop scrimClassName="bg-paper/40" />

      {/* dynamic split gradient — home colour left, away colour right */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(100deg, ${withAlpha(home.primary, 0.22)} 0%, ${withAlpha(
            home.primary,
            0.04
          )} 38%, ${withAlpha(away.primary, 0.04)} 62%, ${withAlpha(away.primary, 0.22)} 100%)`,
        }}
      />

      {/* cinematic spotlight + vignette — focuses the eye on the score while the
          stadium keeps its atmosphere at the edges */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 75% at 50% 46%, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.28) 46%, rgba(255,255,255,0) 72%), radial-gradient(120% 120% at 50% 120%, rgba(11,11,18,0.20) 0%, rgba(11,11,18,0) 55%)",
        }}
      />

      <div className="relative px-4 py-5 sm:px-6 sm:py-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="eyebrow rounded bg-paper/70 px-2 py-0.5 !text-ink backdrop-blur-sm">
            {meta?.competition || "World Cup"}
          </span>
          <StatusBadge status={status} />
        </div>

        <div className="flex items-center justify-between gap-2">
          {/* home */}
          <div className="flex flex-1 flex-col items-center text-center">
            <div className="text-4xl drop-shadow-sm sm:text-5xl" aria-hidden="true">
              {home.flag}
            </div>
            <div
              className="mt-1.5 rounded-md bg-paper/70 px-2 py-0.5 text-sm font-black backdrop-blur-sm sm:text-base"
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
            <div className="text-4xl drop-shadow-sm sm:text-5xl" aria-hidden="true">
              {away.flag}
            </div>
            <div
              className="mt-1.5 rounded-md bg-paper/70 px-2 py-0.5 text-sm font-black backdrop-blur-sm sm:text-base"
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
