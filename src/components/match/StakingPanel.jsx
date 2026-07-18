// Kickoff Cards — the pre-match staking surface inside the Live Match View.
// Pick one of your cards whose nation is in this match, choose a call, and back
// it. When the match resolves, a winning call earns a bonus card; a losing call
// burns the staked card (animated in the outcome view). No money, ever.

import { useMemo, useState } from "react";
import Card from "../cards/Card.jsx";
import {
  ownedCards,
  getStakes,
  backCard,
  unbackCard,
  cardDisplay,
  callPoints,
} from "../../lib/cards.js";
import {
  PLAYER_PREDICTIONS,
  TEAM_PREDICTIONS,
  getPrediction,
  difficultyMeta,
} from "../../data/cardPredictions.js";

const MAX_PLAYERS = 2;
const MAX_TEAM = 1;

export default function StakingPanel({
  scope,
  matchId,
  meta,
  status,
  refreshKey,
  onStake,
  outcomes,
}) {
  const [tab, setTab] = useState("player");
  const [picking, setPicking] = useState(null); // cardKey being assigned a call
  const [error, setError] = useState("");

  const matchTeams = [meta?.home, meta?.away];
  const owned = ownedCards(scope);
  const stakes = getStakes(scope, matchId);
  const stakedKeys = new Set(stakes.map((s) => s.cardKey));

  const relevant = useMemo(
    () =>
      owned.filter((c) => {
        const team = c.kind === "team" ? c.name : c.team;
        return matchTeams.includes(team);
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scope, refreshKey, matchId]
  );

  const players = relevant.filter((c) => c.kind === "player");
  const teams = relevant.filter((c) => c.kind === "team");
  const stakedPlayers = stakes.filter((s) => s.cardKey.startsWith("p:")).length;
  const stakedTeam = stakes.filter((s) => s.cardKey.startsWith("t:")).length;

  const locked = status === "finished";

  // --- Resolved view: show which calls landed and which burned ---------------
  if (locked && outcomes) {
    return (
      <div className="card-light p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="eyebrow">Full time — your calls</span>
          <span className="text-[11px] text-graphite">
            {outcomes.filter((o) => o.won).length}/{outcomes.length} landed ·{" "}
            <span className="font-bold text-ink">
              +{outcomes.reduce((sum, o) => sum + (o.points || 0), 0)} pts
            </span>
          </span>
        </div>
        {outcomes.length === 0 ? (
          <p className="text-sm text-graphite">
            You didn't back any cards on this match.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {outcomes.map((o) => {
              const d = cardDisplay(o.card);
              return (
                <div key={o.cardKey} className="flex flex-col gap-1.5">
                  <Card {...d} state={o.won ? "won" : "burning"} disabled />
                  <div
                    className={`text-center text-[11px] font-bold ${
                      o.won ? "text-primary" : "text-danger"
                    }`}
                  >
                    {o.won ? `Call landed · +${o.points || 0} pts` : "Card burned"}
                  </div>
                  <div className="truncate text-center text-[10px] text-graphite">
                    {o.prediction.label}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <p className="mt-3 text-center text-[10px] uppercase tracking-wider text-graphite">
          Landed calls earn Instinct Points · spend them to revive burned cards in your collection
        </p>
      </div>
    );
  }

  const stake = (cardKey, predictionId) => {
    const isTeam = cardKey.startsWith("t:");
    if (isTeam && stakedTeam >= MAX_TEAM) return setError("You can back 1 team card per match.");
    if (!isTeam && stakedPlayers >= MAX_PLAYERS)
      return setError("You can back up to 2 player cards per match.");
    const res = backCard(scope, matchId, { cardKey, predictionId });
    if (res.error) return setError(res.error);
    setError("");
    setPicking(null);
    onStake?.();
  };

  const unstake = (cardKey) => {
    unbackCard(scope, matchId, cardKey);
    onStake?.();
  };

  const list = tab === "player" ? players : teams;
  const predictions = tab === "player" ? PLAYER_PREDICTIONS : TEAM_PREDICTIONS;

  return (
    <div className="card-light p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="eyebrow">Back your cards</span>
        <span className="text-[11px] text-graphite">
          {stakedPlayers}/{MAX_PLAYERS} players · {stakedTeam}/{MAX_TEAM} team
        </span>
      </div>

      {/* current stakes */}
      {stakes.length > 0 && (
        <div className="mb-4 flex flex-col gap-2">
          {stakes.map((s) => {
            const card = owned.find((c) => c.key === s.cardKey);
            const pred = getPrediction(s.predictionId);
            if (!card || !pred) return null;
            const d = cardDisplay(card);
            const diff = difficultyMeta(pred.difficulty);
            return (
              <div
                key={s.cardKey}
                className="flex items-center gap-3 rounded-lg border border-canvas bg-paper px-3 py-2"
              >
                <span className="text-xl" aria-hidden="true">{d.flag}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-ink">{d.title}</div>
                  <div className="truncate text-[11px]" style={{ color: diff.color }}>
                    {pred.label} · {diff.label}
                  </div>
                </div>
                {!locked && (
                  <button
                    onClick={() => unstake(s.cardKey)}
                    className="rounded-md border border-canvas px-2 py-1 text-[11px] font-semibold text-graphite transition hover:text-ink"
                  >
                    Remove
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {locked ? (
        <p className="text-sm text-graphite">Match finished — calls are locked.</p>
      ) : (
        <>
          {/* tabs */}
          <div className="mb-3 grid grid-cols-2 overflow-hidden rounded-lg border border-canvas">
            {["player", "team"].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setPicking(null);
                  setError("");
                }}
                className={`py-2 text-[12px] font-bold uppercase tracking-wide transition ${
                  tab === t ? "btn-gradient text-paper" : "text-graphite hover:text-ink"
                }`}
              >
                Back a {t}
              </button>
            ))}
          </div>

          {list.length === 0 ? (
            <p className="text-sm text-graphite">
              You don't own a {tab} card from {meta?.home} or {meta?.away}.
            </p>
          ) : picking ? (
            <CallChooser
              predictions={predictions}
              onPick={(pid) => stake(picking, pid)}
              onBack={() => setPicking(null)}
            />
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-6">
              {list.map((c) => {
                const d = cardDisplay(c);
                const isStaked = stakedKeys.has(c.key);
                return (
                  <Card
                    key={c.key}
                    {...d}
                    disabled={isStaked}
                    state={isStaked ? "selected" : "idle"}
                    onClick={() => !isStaked && setPicking(c.key)}
                  />
                );
              })}
            </div>
          )}

          {error && <p className="mt-2 text-xs font-semibold text-danger">{error}</p>}
        </>
      )}
    </div>
  );
}

function CallChooser({ predictions, onPick, onBack }) {
  return (
    <div>
      <button
        onClick={onBack}
        className="mb-2 text-[12px] font-semibold text-graphite transition hover:text-ink"
      >
        ← Pick a different card
      </button>
      <div className="flex flex-col gap-2">
        {predictions.map((p) => {
          const diff = difficultyMeta(p.difficulty);
          return (
            <button
              key={p.id}
              onClick={() => onPick(p.id)}
              className="flex items-center justify-between gap-3 rounded-lg border border-canvas bg-paper px-3 py-2.5 text-left transition hover:border-primary/40"
            >
              <div>
                <div className="flex items-center gap-1.5 text-sm font-bold text-ink">
                  {p.emoji && <span aria-hidden="true">{p.emoji}</span>}
                  {p.label}
                </div>
                <div className="text-[11px] text-graphite">{p.blurb}</div>
              </div>
              <span
                className="shrink-0 rounded-md px-2 py-1 text-[11px] font-black uppercase tracking-wide tnum"
                style={{ background: `${diff.color}22`, color: diff.color }}
              >
                +{callPoints(p)} pts
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
