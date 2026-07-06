import { useMemo } from "react";
import { getPredictions, placePrediction } from "../../lib/predictions.js";

// Interactive "who scores the next goal?" card. This is the player-agency layer:
// instead of passively watching probabilities move, players lock in a pick before
// each goal and earn points + a streak when they're right. Resolution is driven
// by the parent (Match) when a real goal event arrives.
export default function PredictionPanel({
  scope,
  matchId,
  meta,
  teams,
  status,
  minute,
  refreshKey,
  result,
  onPlaced,
}) {
  const state = useMemo(
    () => getPredictions(scope),
    [scope, refreshKey]
  );

  const open = state.open && state.open.matchId === matchId ? state.open : null;
  const finished = status === "finished";
  const live = status === "live";

  const pick = (teamName) => {
    placePrediction(scope, { matchId, pick: teamName, atMinute: minute });
    onPlaced?.();
  };

  return (
    <div className="card overflow-hidden">
      {/* Header: title + running score */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="label text-goal">Make your call</span>
        <div className="flex items-center gap-3 text-right">
          <div>
            <div className="text-sm font-black leading-none text-text-primary tnum">
              {state.points}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-text-secondary">
              pts
            </div>
          </div>
          <div>
            <div
              className={`text-sm font-black leading-none tnum ${
                state.streak > 0 ? "text-primary" : "text-text-secondary"
              }`}
            >
              ×{state.streak}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-text-secondary">
              streak
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Last-resolution feedback banner */}
        {result && (
          <div
            className={`mb-3 rounded-lg border px-3 py-2 text-[13px] font-semibold ${
              result.correct
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-danger/30 bg-danger/10 text-danger"
            }`}
          >
            {result.correct
              ? `Correct — ${result.actualTeam} scored. +${result.awarded} pts`
              : `${result.actualTeam} scored. Not your pick — streak reset.`}
          </div>
        )}

        {finished ? (
          <p className="text-center text-[13px] text-text-secondary">
            Full time · {state.correct}/{state.total} calls right · best streak ×
            {state.best}
          </p>
        ) : open ? (
          <div className="text-center">
            <p className="text-[12px] uppercase tracking-wider text-text-secondary">
              Your call is locked
            </p>
            <p className="mt-1 text-lg font-black text-text-primary">
              {pickedTeam(open.pick, meta, teams)} to score next
            </p>
            <p className="mt-1 text-[12px] text-text-secondary">
              Waiting for the next goal…
            </p>
          </div>
        ) : live ? (
          <>
            <p className="mb-3 text-center text-[13px] font-semibold text-text-primary">
              Who scores the next goal?
            </p>
            <div className="grid grid-cols-2 gap-2">
              <PickButton
                team={teams.home}
                name={meta.home}
                onClick={() => pick(meta.home)}
              />
              <PickButton
                team={teams.away}
                name={meta.away}
                onClick={() => pick(meta.away)}
              />
            </div>
          </>
        ) : (
          <p className="text-center text-[13px] text-text-secondary">
            Predictions open when the match kicks off.
          </p>
        )}
      </div>
    </div>
  );
}

function PickButton({ team, name, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center justify-center gap-2 rounded-lg border border-border bg-surface-2 py-3 text-sm font-bold text-text-primary transition hover:border-primary/50"
      style={{ borderLeft: `3px solid ${team.primary}` }}
    >
      <span className="text-lg leading-none">{team.flag}</span>
      <span>{name}</span>
    </button>
  );
}

function pickedTeam(pickName, meta, teams) {
  const t = pickName === meta.home ? teams.home : teams.away;
  return `${t.flag} ${pickName}`;
}
