// In-app TxLINE live-data activation: runs the on-chain subscribe + activation
// handshake from the connected wallet. Shows progress + graceful errors. When no
// wallet is connected it renders nothing (Home shows the connect button first).

import { useTxlineAccess } from "../../wallet/useTxlineAccess.js";

export default function LiveDataButton({ connected }) {
  const { status, step, error, activate } = useTxlineAccess();

  if (!connected) return null;

  if (status === "active") {
    return (
      <div className="flex items-center justify-center gap-2 rounded-lg border border-canvas bg-canvas px-4 py-2.5 text-xs font-bold text-ink">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ink" />
        </span>
        Live TxLINE data active · World Cup feed (devnet)
      </div>
    );
  }

  const busy = status === "activating";

  return (
    <div className="flex flex-col items-center gap-1.5">
      <button
        onClick={activate}
        disabled={busy}
        className="w-full rounded-lg border border-ink bg-paper py-2.5 text-xs font-bold text-ink transition enabled:hover:bg-canvas disabled:opacity-50"
      >
        {busy ? (step || "Activating…") : "Unlock live World Cup data (TxLINE · devnet)"}
      </button>
      {status === "error" && (
        <p className="text-center text-[11px] text-danger">{error}</p>
      )}
      {!busy && status !== "error" && (
        <p className="text-center text-[11px] text-graphite">
          Free on-chain subscribe + sign — no payment, just devnet SOL for fees.
        </p>
      )}
    </div>
  );
}
