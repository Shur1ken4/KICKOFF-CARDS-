// Drives the TxLINE live-data handshake from the connected wallet and keeps the
// data client (setActiveAuth) in sync. Rehydrates persisted access on load.

import { useCallback, useEffect, useState } from "react";
import { useConnection, useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { activateLiveData, getStoredAuth } from "../services/txlineAuth.js";
import { setActiveAuth } from "../services/txline.js";

export function useTxlineAccess() {
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const { publicKey, signMessage } = useWallet();
  const wallet = publicKey ? publicKey.toBase58() : null;

  const [status, setStatus] = useState("idle"); // idle | activating | active | error
  const [step, setStep] = useState("");
  const [error, setError] = useState("");

  // Rehydrate persisted activation whenever the connected wallet changes.
  useEffect(() => {
    if (!wallet) {
      setActiveAuth(null);
      setStatus("idle");
      return;
    }
    const cached = getStoredAuth(wallet);
    if (cached) {
      setActiveAuth(cached);
      setStatus("active");
    } else {
      setActiveAuth(null);
      setStatus("idle");
    }
  }, [wallet]);

  const activate = useCallback(async () => {
    if (!anchorWallet?.publicKey || !signMessage) {
      setError("Connect a wallet that supports message signing.");
      setStatus("error");
      return;
    }
    setStatus("activating");
    setError("");
    try {
      const auth = await activateLiveData({
        connection,
        anchorWallet,
        signMessage,
        onStep: setStep,
      });
      setActiveAuth(auth);
      setStatus("active");
    } catch (e) {
      setError(e?.message || "Activation failed.");
      setStatus("error");
    }
  }, [connection, anchorWallet, signMessage]);

  return { status, step, error, activate, wallet };
}
