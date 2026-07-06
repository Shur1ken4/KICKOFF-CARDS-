// TxLINE Solana-native access flow (devnet) — light orchestration layer.
//
// Getting live TxLINE data is a 3-step, wallet-driven handshake:
//   1. guest JWT          → POST /auth/guest/start
//   2. on-chain subscribe → Anchor `subscribe(serviceLevelId, weeks)` (free SL 1)
//   3. activate API token → sign "{txSig}::{jwt}", POST /api/token/activate
//
// The heavy on-chain step (Anchor + SPL token) lives in ./txlineSubscribe and is
// dynamically imported only when a user actually activates, keeping it out of the
// initial bundle. The resulting { jwt, apiToken } pair authenticates every data
// request and is persisted so returning users skip the handshake.

import { Connection } from "@solana/web3.js";

export const TXLINE = {
  network: "devnet",
  rpcUrl: "https://api.devnet.solana.com",
  apiOrigin: "https://txline-dev.txodds.com",
  programId: "6pW64gN1s2uqjHkn1unFeEjAwJkPGHoppGvS715wyP2J",
  txlTokenMint: "4Zao8ocPhmMgq7PdsYWyxvqySMGx7xb9cMftPMkEokRG",
};

// Free tier: World Cup + International Friendlies, 60-second delay.
export const SERVICE_LEVEL_ID = 1;
export const DURATION_WEEKS = 4; // subscriptions are sold in 4-week (28-day) blocks
export const SELECTED_LEAGUES = []; // [] = standard World Cup bundle

const AUTH_KEY = "mml:txline:auth";
// Treat a stored token as good for ~3 weeks (subscription lasts 4); re-handshake after.
const AUTH_TTL_MS = 3 * 7 * 24 * 60 * 60 * 1000;

export const apiBaseUrl = `${TXLINE.apiOrigin}/api`;

// --- persisted auth ----------------------------------------------------------
export function getStoredAuth(wallet) {
  try {
    const saved = JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
    if (!saved) return null;
    if (wallet && saved.wallet !== wallet) return null;
    if (Date.now() - saved.ts > AUTH_TTL_MS) return null;
    return saved; // { jwt, apiToken, wallet, txSig, ts }
  } catch {
    return null;
  }
}

function storeAuth(auth) {
  localStorage.setItem(AUTH_KEY, JSON.stringify({ ...auth, ts: Date.now() }));
}

export function clearStoredAuth() {
  localStorage.removeItem(AUTH_KEY);
}

export function makeConnection() {
  return new Connection(TXLINE.rpcUrl, "confirmed");
}

// TxLINE endpoints sometimes return a bare token string (text/plain) and
// sometimes a JSON envelope like { token: "..." }. Accept either shape so we
// never choke calling res.json() on a plain-text token.
function extractToken(raw, keys) {
  const text = (raw || "").trim();
  if (!text) return null;
  try {
    const json = JSON.parse(text);
    if (typeof json === "string") return json;
    for (const k of keys) {
      if (typeof json?.[k] === "string") return json[k];
    }
    return null;
  } catch {
    // Body wasn't JSON — it's the raw token string itself.
    return text;
  }
}

// --- step 1: guest JWT -------------------------------------------------------
async function fetchGuestJwt() {
  const res = await fetch(`${TXLINE.apiOrigin}/auth/guest/start`, { method: "POST" });
  if (!res.ok) throw new Error(`Guest session failed (${res.status})`);
  const jwt = extractToken(await res.text(), ["token", "jwt"]);
  if (!jwt) throw new Error("No guest token returned");
  return jwt;
}

// --- step 3: activate API token ---------------------------------------------
async function activateApiToken({ txSig, jwt, signMessage }) {
  const messageString = `${txSig}:${SELECTED_LEAGUES.join(",")}:${jwt}`;
  const signatureBytes = await signMessage(new TextEncoder().encode(messageString));
  const walletSignature = Buffer.from(signatureBytes).toString("base64");

  const res = await fetch(`${apiBaseUrl}/token/activate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({ txSig, walletSignature, leagues: SELECTED_LEAGUES }),
  });
  if (!res.ok) throw new Error(`Activation failed (${res.status})`);
  const apiToken = extractToken(await res.text(), ["token", "apiToken"]);
  if (!apiToken) throw new Error("No API token returned");
  return apiToken;
}

// --- orchestrator ------------------------------------------------------------
// onStep(label) lets the UI narrate progress through the 3 steps.
export async function activateLiveData({ connection, anchorWallet, signMessage, onStep }) {
  if (!anchorWallet?.publicKey) throw new Error("Connect a wallet first.");
  const wallet = anchorWallet.publicKey.toBase58();

  const cached = getStoredAuth(wallet);
  if (cached) return cached;

  onStep?.("Starting secure session…");
  const jwt = await fetchGuestJwt();

  onStep?.("Approve the subscription in your wallet…");
  // Heavy Anchor/SPL code loaded on demand only.
  const { subscribeOnChain } = await import("./txlineSubscribe.js");
  const txSig = await subscribeOnChain(connection, anchorWallet);

  onStep?.("Sign to activate your data access…");
  const apiToken = await activateApiToken({ txSig, jwt, signMessage });

  const auth = { jwt, apiToken, wallet, txSig };
  storeAuth(auth);
  onStep?.("Live data unlocked.");
  return auth;
}
