import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWalletIdentity } from "../wallet/useWalletIdentity.js";
import { useTxlineAccess } from "../wallet/useTxlineAccess.js";
import LiveDataButton from "../components/common/LiveDataButton.jsx";
import Footer from "../components/common/Footer.jsx";
import { GROUPS, getTeam } from "../data/worldcup2026.js";
import { PLAYERS, tierMeta } from "../data/players.js";
import { collectionScope, seedCollection } from "../lib/cards.js";
import { createLeague, joinLeague, shortWallet } from "../lib/league.js";
import { FEATURED_MATCH_ID } from "../data/mockData.js";

const MAX_TEAMS = 5;
const MAX_PLAYERS = 10;

export default function Onboarding() {
  const navigate = useNavigate();
  const { address, connected } = useWalletIdentity();
  const { status: txStatus } = useTxlineAccess();

  const [step, setStep] = useState(0);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [leagueName, setLeagueName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const toggle = (list, setList, value, max) => {
    setError("");
    if (list.includes(value)) return setList(list.filter((v) => v !== value));
    if (list.length >= max) return setError(`Pick up to ${max}.`);
    setList([...list, value]);
  };

  const seedFor = (scope) => seedCollection(scope, { teams, players });

  const startDemo = () => {
    if (players.length + teams.length === 0) return setError("Pick at least one card to collect.");
    seedFor(collectionScope({ wallet: address || "demo" }));
    navigate(`/match/${FEATURED_MATCH_ID}`);
  };

  const create = () => {
    const res = createLeague(leagueName, { wallet: address });
    if (res.error) return setError(res.error);
    seedFor(collectionScope({ leagueId: res.league.id, wallet: address }));
    navigate(`/league/${res.league.id}`);
  };

  const join = () => {
    if (code.trim().length < 6) return setError("Join codes are 6 characters.");
    const res = joinLeague(code, { wallet: address });
    if (res.error) return setError(res.error);
    seedFor(collectionScope({ leagueId: res.league.id, wallet: address }));
    navigate(`/league/${res.league.id}`);
  };

  const canPick = teams.length + players.length > 0;

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      {/* Hero */}
      <div
        className="wc-hero px-5 pb-16 pt-9 text-paper"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(8,8,16,0) 50%, rgba(8,8,16,0.75) 82%, rgba(8,8,16,0.96) 100%), linear-gradient(100deg, rgba(8,8,16,0.55) 0%, rgba(8,8,16,0.3) 50%, rgba(8,8,16,0.55) 100%), url('/hero-banner-2.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto max-w-3xl">
          <span className="eyebrow !text-paper block border-b border-paper/25 pb-3 text-[13px] font-extrabold uppercase !tracking-[0.28em]">
            World Cup · USA · Canada · Mexico · 2026
          </span>
          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <h1 className="text-[2.6rem] font-black leading-[0.95] tracking-[-0.03em] sm:text-[3rem]">
              Kickoff<br />Cards
            </h1>
            <p className="max-w-xs text-[15px] leading-relaxed text-paper/85 sm:text-right">
              Collect player cards and back one before each match. Your pick
              survives on live World Cup data — or burns if it misses. Whoever
              holds the most cards at the final whistle wins the league.
            </p>
          </div>
        </div>
      </div>

      <div
        className="-mt-10 flex-1"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(8,8,16,0.98) 0%, rgba(8,8,16,0.86) 12%, rgba(8,8,16,0.62) 45%, rgba(8,8,16,0.84) 100%), url('/hero-banner-3.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
        }}
      >
      <div className="mx-auto max-w-lg px-5 pb-8 pt-16">
        <Stepper step={step} />

        {/* Step 1 — Solana sign-up */}
        {step === 0 && (
          <Section
            n={1}
            title="Sign up with Solana"
            desc="Your Solana wallet (devnet) is your player identity across every league."
          >
            <WalletMultiButton />
            <p className="mt-2 text-[12px] text-paper/70">
              {connected ? (
                <>Signed in · <span className="tnum font-semibold text-paper">{shortWallet(address)}</span></>
              ) : (
                "Connect a Solana devnet wallet to continue."
              )}
            </p>
            <NextBtn disabled={!connected} onClick={() => setStep(1)} />
          </Section>
        )}

        {/* Step 2 — TxLINE live data */}
        {step === 1 && (
          <Section
            n={2}
            title="Turn on live World Cup data"
            desc="Kickoff Cards resolves every call on live TxLINE match data. Activate it from your wallet — free, devnet only."
          >
            <LiveDataButton connected={connected} />
            <div className="mt-2 flex items-center gap-2">
              <BackBtn onClick={() => setStep(0)} />
              <NextBtn
                label={txStatus === "active" ? "Continue" : "Skip for now"}
                onClick={() => setStep(2)}
              />
            </div>
          </Section>
        )}

        {/* Step 3 — pick cards */}
        {step === 2 && (
          <Section
            n={3}
            title="Build your starter collection"
            desc={`Pick up to ${MAX_TEAMS} teams and ${MAX_PLAYERS} players. These become your first cards — 100% free.`}
          >
            <PickTeams selected={teams} onToggle={(t) => toggle(teams, setTeams, t, MAX_TEAMS)} />
            <PickPlayers selected={players} onToggle={(p) => toggle(players, setPlayers, p, MAX_PLAYERS)} />
            {error && <p className="mt-2 text-xs font-semibold text-danger">{error}</p>}
            <div className="mt-3 flex items-center gap-2">
              <BackBtn onClick={() => setStep(1)} />
              <NextBtn disabled={!canPick} onClick={() => setStep(3)} />
            </div>
          </Section>
        )}

        {/* Step 4 — start playing */}
        {step === 3 && (
          <Section
            n={4}
            title="Start playing"
            desc="Follow the real World Cup on live TxLINE data, create a league with friends, or try the scripted demo match."
          >
            <div className="flex flex-col gap-4">
              <button
                onClick={() => navigate("/live")}
                className="btn-gradient w-full py-3 text-sm"
              >
                Follow the live World Cup →
              </button>

              <div className="card-light p-4">
                <p className="eyebrow mb-2">Create a league</p>
                <input
                  value={leagueName}
                  onChange={(e) => setLeagueName(e.target.value)}
                  placeholder="The Group Chat Cup"
                  className="w-full rounded-lg border border-canvas bg-paper px-4 py-3 text-sm outline-none focus:border-ink"
                />
                <button onClick={create} className="btn-gradient mt-3 w-full py-3 text-sm">
                  Create league →
                </button>
              </div>

              <div className="card-light p-4">
                <p className="eyebrow mb-2">Join with a code</p>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="6-character code"
                  maxLength={6}
                  className="tnum w-full rounded-lg border border-canvas bg-paper px-4 py-3 text-sm uppercase tracking-[0.3em] outline-none focus:border-ink"
                />
                <button
                  onClick={join}
                  className="mt-3 w-full rounded-lg border border-ink py-3 text-sm font-bold text-ink transition hover:bg-canvas"
                >
                  Join league
                </button>
              </div>

              <button
                onClick={startDemo}
                className="w-full rounded-lg bg-ink py-3 text-sm font-bold text-paper transition hover:opacity-90"
              >
                Try the demo match (scripted) →
              </button>
            </div>
            {error && <p className="mt-2 text-xs font-semibold text-danger">{error}</p>}
            <div className="mt-3">
              <BackBtn onClick={() => setStep(2)} />
            </div>
          </Section>
        )}

        <Footer className="!border-paper/20 !text-paper/70" />
      </div>
      </div>
    </div>
  );
}

function Stepper({ step }) {
  const labels = ["Solana", "Live data", "Cards", "Play"];
  return (
    <div className="mb-6 flex items-center gap-2">
      {labels.map((l, i) => (
        <div key={l} className="flex flex-1 flex-col items-center gap-1">
          <div
            className={`h-1.5 w-full rounded-full ${i <= step ? "bg-paper" : "bg-paper/25"}`}
          />
          <span className={`text-[10px] font-semibold ${i <= step ? "text-paper" : "text-paper/55"}`}>
            {l}
          </span>
        </div>
      ))}
    </div>
  );
}

function Section({ n, title, desc, children }) {
  return (
    <div>
      <p className="eyebrow !text-paper mb-1 flex items-center gap-2">
        <span className="wc-num bg-wc-purple">{n}</span>
        {title}
      </p>
      <p className="mb-4 text-[13px] text-paper/80">{desc}</p>
      {children}
    </div>
  );
}

function NextBtn({ onClick, disabled, label = "Continue" }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="btn-gradient mt-4 w-full py-3 text-sm disabled:cursor-not-allowed disabled:opacity-40"
    >
      {label}
    </button>
  );
}

function BackBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="mt-4 rounded-lg border border-paper/30 px-4 py-3 text-sm font-semibold text-paper/80 transition hover:text-paper"
    >
      Back
    </button>
  );
}

function PickTeams({ selected, onToggle }) {
  return (
    <div className="mb-5">
      <p className="mb-2 text-[12px] font-bold text-paper">
        Teams <span className="text-paper/60">({selected.length}/{MAX_TEAMS})</span>
      </p>
      <div className="max-h-56 overflow-y-auto pr-1">
        {Object.entries(GROUPS).map(([g, names]) => (
          <div key={g} className="mb-2">
            <div className="eyebrow !text-paper/75 mb-1">Group {g}</div>
            <div className="flex flex-wrap gap-1.5">
              {names.map((name) => {
                const t = getTeam(name);
                const on = selected.includes(name);
                return (
                  <button
                    key={name}
                    onClick={() => onToggle(name)}
                    className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-semibold transition"
                    style={{
                      borderColor: on ? t.primary : "#E5E7EB",
                      background: on ? t.primary : "#fff",
                      color: on ? "#fff" : "#000",
                    }}
                  >
                    <span aria-hidden="true">{t.flag}</span>
                    {name}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PickPlayers({ selected, onToggle }) {
  const grouped = useMemo(() => {
    return {
      legend: PLAYERS.filter((p) => p.tier === "legend"),
      rare: PLAYERS.filter((p) => p.tier === "rare"),
      common: PLAYERS.filter((p) => p.tier === "common"),
    };
  }, []);
  return (
    <div>
      <p className="mb-2 text-[12px] font-bold text-paper">
        Players <span className="text-paper/60">({selected.length}/{MAX_PLAYERS})</span>
      </p>
      <div className="max-h-56 overflow-y-auto pr-1">
        {["legend", "rare", "common"].map((tier) => {
          const meta = tierMeta(tier);
          return (
            <div key={tier} className="mb-2">
              <div className="eyebrow mb-1" style={{ color: meta.color }}>
                {meta.label} · {meta.points} pts
              </div>
              <div className="flex flex-wrap gap-1.5">
                {grouped[tier].map((p) => {
                  const on = selected.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => onToggle(p.id)}
                      className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-semibold transition"
                      style={{
                        borderColor: on ? meta.color : "#E5E7EB",
                        background: on ? meta.color : "#fff",
                        color: on ? "#fff" : "#000",
                      }}
                    >
                      <span aria-hidden="true">{getTeam(p.team).flag}</span>
                      {p.name}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
