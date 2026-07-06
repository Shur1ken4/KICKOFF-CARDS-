// Thin wrapper over the wallet adapter that exposes the connected Solana wallet
// as the app's identity: a base58 address string (or null when disconnected).

import { useWallet } from "@solana/wallet-adapter-react";

export function useWalletIdentity() {
  const { publicKey, connected, connecting, disconnect } = useWallet();
  const address = publicKey ? publicKey.toBase58() : null;
  return { address, connected, connecting, disconnect };
}
