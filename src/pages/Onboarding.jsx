import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useWalletIdentity } from "../wallet/useWalletIdentity.js";
import TopNav from "../components/common/TopNav.jsx";
import Footer from "../components/common/Footer.jsx";
import Stepper from "../components/common/Stepper.jsx";
import { HowToPlayButton } from "../components/common/HowToPlay.jsx";
import { GROUPS, getTeam } from "../data/worldcup2026.js";
import { PLAYERS, tierMeta } from "../data/players.js";
import { collectionScope, seedCollection, getCollection } from "../lib/cards.js";
import { createLeague, joinLeague } from "../lib/league.js";
import { FEATURED_MATCH_ID } from "../data/mockData.js";

const MAX_TEAMS = 5;
const MAX_PLAYERS = 10;

// World Cup 2026 brand gradient — identical to the landing page (--wc-spectrum):
// Purple → Pink → Orange → Green → Lime.
const SPECTRUM =
  "linear-gradient(100deg, #a435f0, #e0347a, #ff5a3c, #25c46a, #b6e84a)";

// Selected-state "spectrum border" — a transparent 2px border filled with the
// spectrum gradient via the padding-box / border-box double-background trick.
const SELECTED = {
  border: "2px solid transparent",
  backgroundImage: `linear-gradient(#fff,#fff), ${SPECTRUM}`,
  backgroundOrigin: "border-box",
  backgroundClip: "padding-box, border-box",
};

const POS = { GK: "Goalkeeper", DEF: "Defender", MID: "Midfield", FWD: "Forward" };

// Player portrait renders (from the design export). Players without a render
// fall back to a flag avatar.
const PLAYER_PHOTOS = {
  messi:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAhjfhBjxNArRva559fp5DJOHjWx1rSfGYuapp0nYZ-tu3fGrBPqOUBuLR6kAln0sQedH_S2Zox-KvEUvRL7G1YF3CqFyME7keznFLPrmt1oMujM6mSaxGeKWvolFNnVqxvkyRuCsC2Q3z6mIl4h2RAqX_BYYTg6bBK6LT1yEh3ZhEyEFFLxdOlSD4LXup4TBw9XsWjBBV9h5Qa8hqiQ6xZKITv7wEa4BuJU8-qdUBgeR-wXT2Ia-2I",
  mbappe:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuChXUoa7nvevdP99hfQljcfqcC4mmxiVYDXcQTUPdHOXoCvqFo1kDJ2Kr7xnDH1ZBI_9RlnMsn2Xcz5j6F8qDAeAqgDPHpuruVsYJFrlvta3-oPkBXQkujuPek2KtcQajpkyTNf9uhcSyBza39fev_DwUTtNd9PnGxOuLbtZ6tfomtIEszwV_Fkz-MfrsdN0gzipxp5lDJny-TARO8rMvJGp4LfHzhpj5o9946S-0NWee9PztJnAHMt",
  haaland:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBlfEanzERXLl1ORktf2D5rdzaMuOSsDCNeUT-vIFBQHRLVFRfou-msf_WQKUfuVgxs9M-RrLASZYhkngoZIBcCnHJCVIhQW9UEtVbg_ffu0dCfVQ7AYonnZV9n9_yd5gCGI4clycfUMBi5sZJCF6-MDMM96VZ4lBoQZiwvWOE94TM8-hJW2Ega6QTjLr3BS_T0k3QUO0Y7w2eP1eHdYvQDPJN-FoKArOLwnt7bCNasJbF-nBLqlKGy",
  bellingham:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBFuYWP25NGoC_PagxHF44xXAXnSABk88gt77G8XCMTDAcToJGvt5boICvTfeVyzucXvuriGyrmwnS9RoOwHesS6LUFzQPDU3xQuXHBYaWRr4n1B1VLHINbQzOl33P7IFyA9EYjrg3A-kiQ2pyG3GGApiikJdmuhzl2Gdnb4QonR5dWA-1uvF4wn2fWRw0tuxq-xgdSwFIC-dXotT_J8ndQuYhD2gYPgJa0WRLjUOKQlA5PI0h4SxUF",
  vinicius:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD6w68jLDwgu9lDWSc9NIsGjAXs88MIfBCk4DjY2PxNfsdzsO0Qx9z8Q-eq9k1t142xDofun--TzuNlGwuuP-e5f-4NBp5m1KRWHnHMmy74fv6knWGou1k9JnDhJtkovjLSM0E4m7dgaqX9XeqYN-LWHMfxpVJthh-4IR0GiGt0FvioVsG4yQdygPds0am84vSXfLd4tiarjGgTkg8qIZbHWT7hCrSZNAn_u4Y4XVe_bl--RG8sMkx-",
  debruyne:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDhgg_vfFq-x2AWyL0E6FJbdb4HdA-yn4Ufdq8TmEkj4wr66aCaWr-PeyrKoXlPXorEqoFa3H8jCS9oPUongu4MILGO8ojDGyvbC4pl7CVHMtEGN00FoVI0nv6GLsRxBR7Xi4CtHC9Y6eA97Rjj0UhTss4z_QwfjYwaYVBIHLVhHROLHt7nRtu0jlNPwxv9C5ox1QmvHfZwdmPB8e3gIhLPdSVlQzaVjLVUq0XAUKXF5-_l8h1b_sIt",
  kane:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBn8LqRCJvhDpilFljb-gDZnmcyqq-Vt9U9a-f7QNKxDqS5HWVFUr3-fMKidnkm0Qy5mNDjCGV1yVIVz4k4gWP9p1ruD8ICuuCMdhXBHQxj8asz-HueHXr7shT8Gtytd9sUiQOG6a9MWi1fWNXZ9jKk2gmEZc1MluT06X3tM4tZBSI2PGzTkyzEuq-Ml73X8escrD9GcfhE_qSXVhb7Hw9-gf45R0sLEXzcJ8JXgP2eoMrgasXR4vlK",
  ronaldo:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBFEDDMao3afmYIlhKXfM7q3jQ1K75W8Hl39KvB8Jzqm364EOkNyEzBHsN5MuMOj6pcuiO2hwQg7lsPpLVxinjK8YF_yIBCJiVAeSTilQFpZgYy--snciEAgMR-SiiuFic07wp0_YwuY-zlmaEuYJs6oruT8wcVmtlR07f8SgLcSg45X8q7_8JmHmqWuwJK337VCIDgKuKYybw7LC7RM-orOUxDtGXHPlc6rnXMq-n0C1zmx95ticMA",
  olise: "/players/olise.jpg",
  pedri: "/players/pedri.jpg",
  musiala: "/players/musiala.jpg",
  rodrygo: "/players/rodrygo.jpg",
  martinez: "/players/martinez.jpg",
  leao: "/players/leao.jpg",
  gakpo: "/players/gakpo.jpg",
  son: "/players/son.jpg",
  yamal: "/players/yamal.jpg",
  wirtz: "/players/wirtz.jpg",
  pulisic: "/players/pulisic.jpg",
  modric: "/players/modric.jpg",
  dembele: "/players/dembele.jpg",
  raphinha: "/players/raphinha.jpg",
  foden: "/players/foden.jpg",
  gavi: "/players/gavi.jpg",
  depay: "/players/depay.jpg",
  mitoma: "/players/mitoma.jpg",
  alvarez: "/players/alvarez.jpg",
  davies: "/players/davies.jpg",
  mane: "/players/mane.jpg",
  hakimi: "/players/hakimi.jpg",
  valverde: "/players/valverde.jpg",
  yildiz: "/players/yildiz.jpg",
  lozano: "/players/lozano.jpg",
  gimenez: "/players/gimenez.jpg",
};

export default function Onboarding() {
  const navigate = useNavigate();
  const location = useLocation();
  const { address, connected } = useWalletIdentity();

  // The Landing "Enter Kickoff Cards" CTA arrives with { showHowTo: true } to
  // auto-open the explainer once. Clear it so a later refresh doesn't reopen it.
  const [showHowTo] = useState(!!location.state?.showHowTo);
  useEffect(() => {
    if (location.state?.showHowTo) {
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A returning player's selection is locked in — their first picks become their
  // permanent starter collection. Re-entering onboarding (to go live, run the
  // demo, or create/join a league) shows those picks pre-selected and disabled,
  // so they carry the same cards into every league and can't silently re-roll.
  const baseScope = collectionScope({ wallet: address || "demo" });
  const [seeded] = useState(() => getCollection(baseScope));
  // Locking a starter collection is an account feature: only a connected wallet
  // gets a permanent, non-re-rollable set. Guests (no wallet) can always freely
  // select and re-pick, so browsing without an account never locks anything.
  const locked = connected && !!seeded.seeded;

  const [teams, setTeams] = useState(() =>
    seeded.seeded ? seeded.owned.filter((c) => c.kind === "team").map((c) => c.name) : []
  );
  const [players, setPlayers] = useState(() =>
    seeded.seeded ? seeded.owned.filter((c) => c.kind === "player").map((c) => c.id) : []
  );
  const [leagueName, setLeagueName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const toggle = (list, setList, value, max) => {
    if (locked) return; // selection is locked in — no re-picking
    setError("");
    if (list.includes(value)) return setList(list.filter((v) => v !== value));
    if (list.length >= max) return setError(`Pick up to ${max}.`);
    setList([...list, value]);
  };

  const seedFor = (scope) => seedCollection(scope, { teams, players });

  const continueSelection = () => {
    if (players.length + teams.length === 0)
      return setError("Pick at least one card to collect.");
    seedFor(baseScope);
    navigate("/live");
  };

  const startDemo = () => {
    if (players.length + teams.length === 0)
      return setError("Pick at least one card to collect.");
    seedFor(baseScope);
    navigate(`/match/${FEATURED_MATCH_ID}`);
  };

  const create = () => {
    if (!connected) return setError("Connect your wallet to create a league.");
    const res = createLeague(leagueName, { wallet: address });
    if (res.error) return setError(res.error);
    // Lock the selection globally first, then carry it into the new league so
    // future onboarding visits show it pre-selected and disabled.
    seedFor(baseScope);
    seedFor(collectionScope({ leagueId: res.league.id, wallet: address }));
    navigate(`/league/${res.league.id}`);
  };

  const join = () => {
    if (!connected) return setError("Connect your wallet to join a league.");
    if (code.trim().length < 6) return setError("Join codes are 6 characters.");
    const res = joinLeague(code, { wallet: address });
    if (res.error) return setError(res.error);
    seedFor(baseScope);
    seedFor(collectionScope({ leagueId: res.league.id, wallet: address }));
    navigate(`/league/${res.league.id}`);
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white text-[#1c1c1b]">
      <TopNav />

      <div style={{ zoom: 0.9 }} className="flex flex-grow flex-col">
      {/* Onboarding spine — the shared 4-step loop. This page is step 2:
          "Pick your cards" (step 1 done once a wallet is connected). */}
      <Stepper current={2} />
      <div className="mx-auto flex w-full max-w-4xl justify-end px-4 pt-3">
        <HowToPlayButton defaultOpen={showHowTo} />
      </div>

      {locked && (
        <div className="mx-auto mt-3 w-full max-w-4xl px-4">
          <div className="flex items-center gap-3 rounded-xl border border-[#d1c1d7] bg-[#f5f0f7] px-4 py-3">
            <LockGlyph />
            <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#4e4354]">
              Your selection is locked in — these cards come with you into every league.
            </p>
          </div>
        </div>
      )}

      <main className="relative flex-grow overflow-hidden">
        {/* Hero — host-city triptych (USA · Canada · Mexico) washed with the
            World Cup gradient. Sized to match the schedule page's banner. */}
        <section className="wc-hero relative z-10 px-5 pb-8 pt-9 text-paper">
          <div className="mx-auto max-w-4xl">
            <span className="eyebrow !text-paper/85">
              World Cup · USA · Canada · Mexico · 2026
            </span>
            <h1 className="mt-2 text-3xl font-black leading-[0.95] tracking-[-0.03em]">
              Pick Your Teams &amp; Players
            </h1>
            <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-paper/85">
              Select the backbone of your starter pack. Choose {MAX_TEAMS} nations and{" "}
              {MAX_PLAYERS} world-class athletes to begin your journey toward the 2026
              World Cup championship. 100% free.
            </p>
          </div>
        </section>

        {/* Selection grid */}
        <section className="relative z-10 mx-auto max-w-6xl px-4 pb-40 pt-10">
          {/* Start playing — league / demo. Placed first so a player can jump
              straight into creating or joining a league on arrival. */}
          <div className="mb-16">
            <SectionHead title="Start Playing" eyebrow="Leagues & Demo" />
            {!connected && (
              <div className="mb-4 flex items-center gap-3 rounded-xl border border-[#d1c1d7] bg-[#f5f0f7] px-4 py-3">
                <LockGlyph />
                <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#4e4354]">
                  Connect your wallet to create or join leagues.
                </p>
              </div>
            )}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="border border-[#d1c1d7] bg-white p-6">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#4e4354]">
                  Create a league
                </p>
                <input
                  value={leagueName}
                  onChange={(e) => setLeagueName(e.target.value)}
                  placeholder="The Group Chat Cup"
                  className="w-full rounded-sm border border-[#d1c1d7] bg-white px-4 py-3 text-sm outline-none focus:border-[#6700a1]"
                />
                <button
                  onClick={create}
                  disabled={!connected}
                  style={connected ? { background: SPECTRUM } : undefined}
                  className={`mt-3 flex w-full items-center justify-center gap-2 rounded-full py-3 text-[12px] font-bold uppercase tracking-[0.2em] transition-all ${
                    connected
                      ? "text-white active:scale-95"
                      : "cursor-not-allowed bg-[#eadff0] text-[#4e4354] opacity-70"
                  }`}
                >
                  Create league →
                </button>
              </div>

              <div className="border border-[#d1c1d7] bg-white p-6">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#4e4354]">
                  Join with a code
                </p>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="6-CHARACTER CODE"
                  maxLength={6}
                  className="w-full rounded-sm border border-[#d1c1d7] bg-white px-4 py-3 text-sm uppercase tracking-[0.3em] outline-none focus:border-[#6700a1]"
                />
                <button
                  onClick={join}
                  disabled={!connected}
                  className={`mt-3 w-full rounded-full border-2 py-3 text-[12px] font-bold uppercase tracking-[0.2em] transition-all ${
                    connected
                      ? "border-[#1c1c1b] text-[#1c1c1b] hover:bg-[#1c1c1b] hover:text-white active:scale-95"
                      : "cursor-not-allowed border-[#d1c1d7] text-[#4e4354] opacity-70"
                  }`}
                >
                  Join league
                </button>
              </div>
            </div>

            <button
              onClick={startDemo}
              className="mt-4 w-full rounded-full bg-[#1c1c1b] py-4 text-[12px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:opacity-90 active:scale-95"
            >
              Try the demo match (scripted) →
            </button>
          </div>

          {/* Teams */}
          <div className="mb-16">
            <SectionHead
              title={`Select ${MAX_TEAMS} Teams`}
              eyebrow="National Glory Awaits"
              count={teams.length}
              max={MAX_TEAMS}
              primary
            />
            <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
              {Object.entries(GROUPS).map(([g, names]) => {
                const picked = names.filter((n) => teams.includes(n)).length;
                return (
                  <div
                    key={g}
                    className="rounded-2xl border border-[#d1c1d7] bg-white p-3 shadow-sm sm:p-5"
                  >
                    {/* Group header — label + spectrum accent line */}
                    <div className="mb-4">
                      <div className="flex items-baseline justify-between">
                        <h3 className="text-lg font-black uppercase tracking-tight text-[#1c1c1b]">
                          Group {g}
                        </h3>
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#4e4354] opacity-60">
                          {picked}/4
                        </span>
                      </div>
                      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[#eadff0]">
                        <div
                          style={{ background: SPECTRUM }}
                          className="h-full w-full"
                        />
                      </div>
                    </div>
                    {/* Team rows — selectable */}
                    <div className="space-y-1.5">
                      {names.map((name) => {
                        const t = getTeam(name);
                        const on = teams.includes(name);
                        return (
                          <button
                            key={name}
                            onClick={() => toggle(teams, setTeams, name, MAX_TEAMS)}
                            disabled={locked && !on}
                            style={on ? SELECTED : undefined}
                            className={`flex w-full items-center gap-3 rounded-lg border-2 px-3 py-2.5 text-left text-[13px] font-bold uppercase tracking-[0.08em] transition-all active:scale-[0.98] ${
                              on
                                ? "text-[#6700a1]"
                                : locked
                                ? "border-transparent text-[#1c1c1b] opacity-40 grayscale"
                                : "border-transparent text-[#1c1c1b] hover:bg-[#f5f0f7]"
                            }`}
                          >
                            <span
                              aria-hidden="true"
                              className="text-lg leading-none"
                            >
                              {t.flag}
                            </span>
                            <span className="truncate">{name}</span>
                            <span className="ml-auto shrink-0">
                              {on ? <CheckIcon /> : locked ? <LockGlyph /> : null}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Players */}
          <div>
            <SectionHead
              title={`Select ${MAX_PLAYERS} Players`}
              eyebrow="Build Your Dream Roster"
              count={players.length}
              max={MAX_PLAYERS}
            />
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
              {PLAYERS.map((p) => {
                const on = players.includes(p.id);
                const tier = tierMeta(p.tier);
                const photo = PLAYER_PHOTOS[p.id];
                return (
                  <button
                    key={p.id}
                    onClick={() => toggle(players, setPlayers, p.id, MAX_PLAYERS)}
                    disabled={locked && !on}
                    style={on ? SELECTED : undefined}
                    className={`group flex items-center gap-2.5 p-3 text-left transition-all active:scale-[0.98] sm:gap-4 sm:p-4 ${
                      on
                        ? ""
                        : locked
                        ? "border border-[#d1c1d7] bg-white opacity-40 grayscale"
                        : "border border-[#d1c1d7] bg-white hover:-translate-y-1 hover:shadow-xl"
                    }`}
                  >
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e5e2e0] sm:h-12 sm:w-12"
                      style={{ border: `2px solid ${tier.color}` }}
                    >
                      {photo ? (
                        <img src={photo} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span aria-hidden="true" className="text-xl leading-none">
                          {getTeam(p.team).flag}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-bold text-[#1c1c1b] transition-colors group-hover:text-[#6700a1]">
                        {p.name}
                      </p>
                      <p className="truncate text-[10px] uppercase tracking-tight text-[#4e4354]">
                        {p.team} • {POS[p.pos] || p.pos}
                      </p>
                    </div>
                    <div className="ml-auto shrink-0">
                      {on ? <CheckIcon /> : locked ? <LockGlyph /> : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <p className="mt-6 text-center text-[12px] font-bold uppercase tracking-[0.15em] text-[#ba1a1a]">
              {error}
            </p>
          )}

          <Footer />
        </section>
      </main>

      {/* Sticky action bar */}
      <footer className="fixed bottom-0 left-0 z-40 w-full border-t border-[#d1c1d7] bg-white/90 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4">
          <div className="hidden md:block">
            <p className="text-[11px] font-medium uppercase tracking-[0.02em] text-[#4e4354]">
              Selection Progress
            </p>
            <div className="mt-1 flex gap-4">
              <span className="text-[10px] font-bold uppercase text-[#6700a1]">
                Teams: {teams.length}/{MAX_TEAMS}
              </span>
              <span className="text-[10px] font-bold uppercase text-[#4e4354]">
                Players: {players.length}/{MAX_PLAYERS}
              </span>
            </div>
          </div>
          <button
            onClick={continueSelection}
            style={{ background: SPECTRUM }}
            className="flex w-full items-center justify-center gap-2 rounded-full px-12 py-4 text-[12px] font-bold uppercase tracking-[0.2em] text-white shadow-2xl shadow-[#6700a1]/30 transition-all hover:-translate-y-1 active:scale-95 md:w-auto"
          >
            Play →
          </button>
        </div>
      </footer>
      </div>
    </div>
  );
}

function SectionHead({ title, eyebrow, count, max, primary }) {
  return (
    <div className="mb-8 flex items-end justify-between border-b border-[#d1c1d7] pb-4">
      <div>
        <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-[#1c1c1b]">
          {title}
        </h2>
        <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.2em] text-[#4e4354]">
          {eyebrow}
        </p>
      </div>
      {typeof count === "number" && (
        <div
          className={`shrink-0 rounded-full border px-3 py-1 text-[12px] font-bold uppercase tracking-[0.15em] ${
            primary
              ? "border-[#6700a1]/20 bg-[#8900d4]/10 text-[#6700a1]"
              : "border-[#d1c1d7] bg-[#f0edeb] text-[#4e4354]"
          }`}
        >
          {count}/{max} Selected
        </div>
      )}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-6 w-6 text-[#6700a1]"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1.2 14.3-3.5-3.5 1.4-1.4 2.1 2.1 4.9-4.9 1.4 1.4-6.3 6.3z" />
    </svg>
  );
}

function LockGlyph() {
  return (
    <svg
      className="h-5 w-5 text-[#4e4354]"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm-3 8V7a3 3 0 1 1 6 0v3H9z" />
    </svg>
  );
}
