// Heavy on-chain step for the TxLINE handshake — Anchor + SPL Token-2022.
// Dynamically imported by txlineAuth.activateLiveData() so it stays out of the
// initial bundle (only loaded when a user actually activates live data).

import * as anchor from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountIdempotentInstruction,
} from "@solana/spl-token";
import { TXLINE, SERVICE_LEVEL_ID, DURATION_WEEKS } from "./txlineAuth.js";
import txoracleIdl from "../idl/txoracle.json";

const PROGRAM_ID = new PublicKey(TXLINE.programId);
const TXL_MINT = new PublicKey(TXLINE.txlTokenMint);

// `anchorWallet` is the object from useAnchorWallet() (publicKey + signTransaction).
export async function subscribeOnChain(connection, anchorWallet) {
  const provider = new anchor.AnchorProvider(connection, anchorWallet, {
    commitment: "confirmed",
  });

  // Prefer the IDL bundled at build time (reliable at demo time). Fall back to
  // fetching the on-chain copy only if the bundled file is somehow unusable.
  let idl = txoracleIdl;
  if (!idl?.instructions?.length) {
    idl = await anchor.Program.fetchIdl(PROGRAM_ID, provider);
  }
  if (!idl) throw new Error("Could not load the TxLINE program IDL.");

  // Guard: the bundled IDL must target the program we think we're calling.
  const idlProgramId = idl.address || idl.metadata?.address;
  if (idlProgramId && idlProgramId !== PROGRAM_ID.toBase58()) {
    throw new Error("TxLINE IDL program id does not match the configured program.");
  }

  const program = new anchor.Program(idl, provider);

  const user = anchorWallet.publicKey;

  const [tokenTreasuryPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("token_treasury_v2")],
    PROGRAM_ID
  );
  const [pricingMatrixPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("pricing_matrix")],
    PROGRAM_ID
  );
  const tokenTreasuryVault = getAssociatedTokenAddressSync(
    TXL_MINT,
    tokenTreasuryPda,
    true,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  const userTokenAccount = getAssociatedTokenAddressSync(
    TXL_MINT,
    user,
    false,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  // Free tier transfers nothing, but the instruction still references the user's
  // TXL token account — make sure it exists (idempotent, costs only rent).
  const ensureAta = createAssociatedTokenAccountIdempotentInstruction(
    user,
    userTokenAccount,
    user,
    TXL_MINT,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  return program.methods
    .subscribe(SERVICE_LEVEL_ID, DURATION_WEEKS)
    .accountsPartial({
      user,
      pricingMatrix: pricingMatrixPda,
      tokenMint: TXL_MINT,
      userTokenAccount,
      tokenTreasuryVault,
      tokenTreasuryPda,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .preInstructions([ensureAta])
    .rpc();
}
