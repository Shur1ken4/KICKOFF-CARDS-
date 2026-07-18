import { Link } from "react-router-dom";
import { getTeam, groupOf, withAlpha } from "../../data/teams.js";
import StatusBadge from "../common/StatusBadge.jsx";

const EVENT_ICON = { goal: "⚽", yellow: "🟨", red: "🟥", sub: "🔁" };

const isLive = (s) => s === "live" || s === "ht";

function EventTicker({ ev, className = "" }) {
  if (!ev) return null;
  return (
    <span className={`flex items-center gap-1.5 text-[11px] text-graphite ${className}`}>
      <span aria-hidden="true">{EVENT_ICON[ev.type] || "•"}</span>
      <span className="tnum font-bold text-ink">{ev.minute}'</span>
      <span className="truncate">
        {ev.player}
        {ev.team ? <span className="text-graphite"> · {ev.team}</span> : null}
      </span>
    </span>
  );
}

function scoreOrKickoff(fx) {
  return fx.status === "upcoming" ? fx.kickoff : `${fx.score.home}–${fx.score.away}`;
}

function FeaturedMatch({ fx, leagueId, demo = false }) {
  const home = getTeam(fx.home);
  const away = getTeam(fx.away);
  const live = isLive(fx.status);
  const to = leagueId ? `/match/${fx.id}?league=${leagueId}` : `/match/${fx.id}`;

  // Only label a group when both teams actually share one (real group-stage
  // fixtures); hidden for cross-group / knockout ties like the demo match.
  const group = groupOf(fx.home) === groupOf(fx.away) ? groupOf(fx.home) : null;
  // Brand rainbow used for the top accent strip + the live pill.
  const brand = "linear-gradient(100deg,#7a2ff0 0%,#ef4a7d 45%,#ff8a3d 70%,#3ecb7a 100%)";

  return (
    <Link
      to={to}
      className="group relative mb-4 block overflow-hidden rounded-2xl border border-black/[0.08] bg-white p-5 shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition hover:border-ink"
    >
      {/* Brand accent strip across the very top of the card. */}
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: brand }}
        aria-hidden="true"
      />

      <div className="relative flex min-h-[15.5rem] flex-col">
        {/* Header: label chips + live status */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-ink/[0.06] px-2.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.07em] text-ink">
              {demo ? "Demo match" : "Featured match"}
            </span>
            {demo ? (
              <span className="rounded-md bg-ink/[0.06] px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.05em] text-graphite">
                Scripted
              </span>
            ) : (
              group && (
                <span className="rounded-md bg-ink/[0.06] px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.05em] text-graphite">
                  Group {group}
                </span>
              )
            )}
          </div>
          <div className="flex items-center gap-2">
            {live ? (
              <>
                <span className="tnum text-[13px] font-bold text-ink">{fx.minute}'</span>
                <span
                  className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.04em] text-white"
                  style={{ background: brand }}
                >
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                  Live
                </span>
              </>
            ) : (
              <StatusBadge status={fx.status} />
            )}
          </div>
        </div>

        {/* Score row: flag + name on each side, combined score in the centre. */}
        <div className="flex flex-1 items-center justify-center gap-8 sm:gap-11">
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[34px] leading-none" aria-hidden="true">{home.flag}</span>
            <span className="text-[13px] font-extrabold uppercase tracking-tight text-ink">{fx.home}</span>
          </div>
          <span className="text-[27px] font-black leading-none tnum text-ink">
            {scoreOrKickoff(fx)}
          </span>
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[34px] leading-none" aria-hidden="true">{away.flag}</span>
            <span className="text-[13px] font-extrabold uppercase tracking-tight text-ink">{fx.away}</span>
          </div>
        </div>

        {/* Footer: last event line + full-width CTA. */}
        <div>
          {fx.lastEvent && (
            <div className="mb-2.5 flex justify-center sm:justify-start">
              <EventTicker ev={fx.lastEvent} />
            </div>
          )}
          <span className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-ink px-4 py-3 text-sm font-bold text-paper transition group-hover:opacity-90">
            {fx.status === "finished" ? "View result" : "Back a card"}
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

function MatchRow({ fx, leagueId, memberTeams }) {
  const home = getTeam(fx.home);
  const away = getTeam(fx.away);
  const live = isLive(fx.status);
  const involved =
    memberTeams.includes(fx.home) || memberTeams.includes(fx.away);
  const to = leagueId ? `/match/${fx.id}?league=${leagueId}` : `/match/${fx.id}`;
  const wash = live
    ? {
        backgroundImage: `linear-gradient(90deg, ${withAlpha(home.primary, 0.12)}, ${withAlpha(
          away.primary,
          0.12
        )})`,
      }
    : undefined;

  return (
    <Link
      to={to}
      className="group relative flex items-center gap-2 overflow-hidden rounded-lg border bg-paper px-3 py-2.5 transition hover:border-ink sm:gap-3"
      style={{ borderColor: involved ? "#000000" : "#E5E7EB", ...wash }}
    >
      {involved && (
        <span className="absolute left-0 top-0 h-full w-1 bg-ink" aria-hidden="true" />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="flex min-w-0 flex-1 items-center gap-2">
            <span className="shrink-0 text-lg" aria-hidden="true">{home.flag}</span>
            <span className="truncate text-sm font-bold text-ink">{fx.home}</span>
          </span>
          <span className="tnum shrink-0 whitespace-nowrap rounded bg-canvas px-1.5 py-0.5 text-sm font-bold text-ink sm:px-2">
            {scoreOrKickoff(fx)}
          </span>
          <span className="flex min-w-0 flex-1 items-center justify-end gap-2">
            <span className="truncate text-sm font-bold text-ink">{fx.away}</span>
            <span className="shrink-0 text-lg" aria-hidden="true">{away.flag}</span>
          </span>
        </div>
        {fx.lastEvent && <EventTicker ev={fx.lastEvent} className="mt-1" />}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {live && <span className="tnum text-xs text-graphite">{fx.minute}'</span>}
        <StatusBadge status={fx.status} />
      </div>
    </Link>
  );
}

function SectionHeader({ label, count, dot }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-70" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-danger" />
        </span>
      )}
      <span className="text-[11px] font-black uppercase tracking-wider text-graphite">
        {label}
      </span>
      <span className="text-[11px] text-graphite">· {count}</span>
    </div>
  );
}

export default function TodaysMatches({
  fixtures,
  leagueId,
  memberTeams = [],
  featured = false,
  heroFixture = null,
}) {
  // A pinned hero (the always-on demo match) wins the featured slot; otherwise,
  // when `featured`, promote the first live match — or next upcoming — to it.
  const autoHero =
    !heroFixture && featured
      ? fixtures.find((f) => isLive(f.status)) ||
        fixtures.find((f) => f.status === "upcoming") ||
        null
      : null;
  const hero = heroFixture || autoHero;

  // The hero never also appears in the list below it.
  const rows = hero ? fixtures.filter((f) => f.id !== hero.id) : fixtures;
  const live = rows.filter((f) => isLive(f.status));
  const upcoming = rows.filter((f) => f.status === "upcoming");
  const finished = rows.filter((f) => f.status === "finished");

  const sections = [
    { key: "live", label: "Live", rows: live, dot: true },
    { key: "upcoming", label: "Upcoming", rows: upcoming, dot: false },
    { key: "finished", label: "Full time", rows: finished, dot: false },
  ].filter((s) => s.rows.length > 0);

  return (
    <>
      {hero && (
        <FeaturedMatch fx={hero} leagueId={leagueId} demo={Boolean(heroFixture)} />
      )}
      <div className="card-light p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="eyebrow">Today's Matches</span>
          <span className="text-[11px] text-graphite">{fixtures.length} fixtures</span>
        </div>
        {fixtures.length === 0 ? (
          <p className="py-6 text-center text-sm text-graphite">
            No fixtures scheduled.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {sections.map((s) => (
              <div key={s.key}>
                <SectionHeader label={s.label} count={s.rows.length} dot={s.dot} />
                <div className="flex flex-col gap-2">
                  {s.rows.map((fx) => (
                    <MatchRow
                      key={fx.id}
                      fx={fx}
                      leagueId={leagueId}
                      memberTeams={memberTeams}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
