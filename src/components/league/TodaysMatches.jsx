import { Link } from "react-router-dom";
import { getTeam } from "../../data/teams.js";
import StatusBadge from "../common/StatusBadge.jsx";

function MatchRow({ fx, leagueId, memberTeams }) {
  const home = getTeam(fx.home);
  const away = getTeam(fx.away);
  const involved =
    memberTeams.includes(fx.home) || memberTeams.includes(fx.away);
  const to = leagueId ? `/match/${fx.id}?league=${leagueId}` : `/match/${fx.id}`;

  return (
    <Link
      to={to}
      className="group relative flex items-center gap-3 overflow-hidden rounded-lg border bg-paper px-3 py-2.5 transition hover:border-ink"
      style={{ borderColor: involved ? "#000000" : "#E5E7EB" }}
    >
      {involved && (
        <span className="absolute left-0 top-0 h-full w-1 bg-ink" aria-hidden="true" />
      )}
      <div className="flex flex-1 items-center gap-2">
        <span className="text-lg" aria-hidden="true">
          {home.flag}
        </span>
        <span className="text-sm font-bold text-ink">{fx.home}</span>
        <span className="tnum mx-1 rounded bg-canvas px-2 py-0.5 text-sm font-bold text-ink">
          {fx.status === "upcoming" ? fx.kickoff : `${fx.score.home}–${fx.score.away}`}
        </span>
        <span className="text-sm font-bold text-ink">{fx.away}</span>
        <span className="text-lg" aria-hidden="true">
          {away.flag}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {fx.status === "live" && (
          <span className="tnum text-xs text-graphite">{fx.minute}'</span>
        )}
        <StatusBadge status={fx.status} />
      </div>
    </Link>
  );
}

export default function TodaysMatches({ fixtures, leagueId, memberTeams = [] }) {
  return (
    <div className="card-light p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="eyebrow">Today's Matches</span>
        <span className="text-[11px] text-graphite">{fixtures.length} fixtures</span>
      </div>
      <div className="flex flex-col gap-2">
        {fixtures.length === 0 ? (
          <p className="py-6 text-center text-sm text-graphite">
            No fixtures scheduled.
          </p>
        ) : (
          fixtures.map((fx) => (
            <MatchRow key={fx.id} fx={fx} leagueId={leagueId} memberTeams={memberTeams} />
          ))
        )}
      </div>
    </div>
  );
}
