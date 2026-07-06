// Solana wallet sign-up layer.
// Wraps the app in the wallet-adapter providers on DEVNET. Modern wallets
// (Phantom, Solflare, Backpack) auto-register via the Wallet Standard, so we
// pass an empty adapters array and let them be detected automatically.

import { useMemo } from "react";
import { clusterApiUrl } from "@solana/web3.js";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";

export const SOLANA_NETWORK = "devnet";

export default function SolanaProvider({ children }) {
  const endpoint = useMemo(() => clusterApiUrl(SOLANA_NETWORK), []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
