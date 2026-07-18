// The 4-step spine of Kickoff Cards, shared across Onboarding / Live / Match so
// a new player always knows where they are in the loop:
//   1. Connect Solana  2. Pick your cards  3. Follow a live match  4. Back & resolve
// Purely presentational — pass `current` (1-4) to mark the active step; every
// step before it renders as completed.

const SPECTRUM =
  "linear-gradient(100deg, #a435f0, #e0347a, #ff5a3c, #25c46a, #b6e84a)";

const STEPS = [
  { n: 1, label: "Connect Solana", hint: "Sign in with your wallet" },
  { n: 2, label: "Pick your cards", hint: "Build a starter collection" },
  { n: 3, label: "Follow a live match", hint: "Real World Cup data" },
  { n: 4, label: "Back & resolve", hint: "Win a card or watch it burn" },
];

export default function Stepper({ current = 1 }) {
  return (
    <div className="w-full border-b border-[#d1c1d7] bg-white py-3.5 sm:py-5">
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex items-start">
          {STEPS.map((s, i) => {
            const done = s.n < current;
            const active = s.n === current;
            const isLast = i === STEPS.length - 1;
            return (
              <div key={s.n} className="flex flex-1 items-start">
                <div className="flex flex-col items-center text-center">
                  <span
                    style={done || active ? { background: SPECTRUM } : undefined}
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-black sm:h-7 sm:w-7 sm:text-[11px] ${
                      done || active
                        ? "text-white"
                        : "bg-[#eadff0] text-[#4e4354]"
                    }`}
                  >
                    {done ? "✓" : s.n}
                  </span>
                  <span
                    className={`mt-1.5 text-[10px] font-bold uppercase tracking-[0.12em] sm:mt-2 sm:text-[11px] ${
                      active
                        ? "text-[#6700a1]"
                        : done
                        ? "text-[#1c1c1b]"
                        : "text-[#4e4354]"
                    }`}
                  >
                    {s.label}
                  </span>
                  <span className="mt-0.5 hidden max-w-[7.5rem] text-[10px] leading-tight text-[#4e4354] opacity-70 sm:block">
                    {s.hint}
                  </span>
                </div>
                {!isLast && (
                  <div className="mt-3 h-0.5 flex-1 overflow-hidden rounded-full bg-[#eadff0] sm:mt-3.5">
                    <div
                      style={done ? { background: SPECTRUM } : undefined}
                      className={`h-full transition-all duration-500 ${
                        done ? "w-full" : "w-0"
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
