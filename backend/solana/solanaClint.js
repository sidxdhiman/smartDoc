import {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

// Connect to Solana Devnet
const connection = new Connection(
  "https://api.devnet.solana.com",
  "confirmed"
);

// Temporary payer wallet (dev only)
const payer = Keypair.generate();

console.log("🔑 Solana Wallet:", payer.publicKey.toBase58());

export async function sendSolanaTransaction() {
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: payer.publicKey,
      lamports: 0, // only fee
    })
  );

  const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [payer]
  );

  const txDetails = await connection.getTransaction(signature, {
    commitment: "confirmed",
  });

  const feeLamports = txDetails.meta.fee;
  const feeSOL = feeLamports / LAMPORTS_PER_SOL;

  return {
    network: "Solana Devnet",
    signature,
    feeLamports,
    feeSOL,
  };
}
