import { ethers } from "ethers";
// We'll also need the IPFS client, let's set it up here too
import { create } from "ipfs-http-client";
import "dotenv/config"; // Make sure .env is loaded

// --- 1. SET UP ALL KEYS & CONNECTIONS ---
// This code runs ONCE when your server starts.

// --- A) Check for all required environment variables ---
const myKey = process.env.PRIVATE_KEY;
const rpcUrl = process.env.SEPOLIA_RPC_URL;
const ipfsProjectId = process.env.IPFS_PROJECT_ID;
const ipfsProjectSecret = process.env.IPFS_PROJECT_SECRET;

if (!myKey || myKey.length < 60) {
  console.error("❌ FATAL ERROR: PRIVATE_KEY is not loaded from .env file.");
  console.error(
    "   Make sure it's in .env and 'dotenv/config' is the FIRST import in server.js"
  );
  process.exit(1);
}

if (!rpcUrl) {
  console.error(
    "❌ FATAL ERROR: SEPOLIA_RPC_URL is not loaded from .env file."
  );
  console.error(
    "   Make sure you have added the free public RPC URL to your .env file."
  );
  process.exit(1);
}

if (!ipfsProjectId || !ipfsProjectSecret) {
  console.error(
    "❌ FATAL ERROR: IPFS_PROJECT_ID or IPFS_PROJECT_SECRET is not loaded."
  );
  process.exit(1);
}

// --- B) Create the Ethers.js Provider and Wallet ---
console.log(`✅ Connecting to Sepolia via: ${rpcUrl.substring(0, 30)}...`);

// Create the provider (your "phone line" to Sepolia)
// This is the fix for your "provider already declared" and "provider not initialized" errors
const provider = new ethers.JsonRpcProvider(rpcUrl);

// Create the wallet (your "pen" to sign transactions)
// This is the fix for your "invalid private key" error
const wallet = new ethers.Wallet(myKey, provider);

console.log(`✅ Ethers wallet loaded. Address: ${wallet.address}`);

// --- C) Create the IPFS Client ---
const auth =
  "Basic " +
  Buffer.from(ipfsProjectId + ":" + ipfsProjectSecret).toString("base64");
const ipfsClient = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});
console.log("✅ IPFS client connected to Infura.");

// --- 2. DEFINE CONTROLLER FUNCTIONS ---
// These functions can now use the `wallet`, `provider`, and `ipfsClient`
// variables that were created above.

export const issueCertificate = async (req, res) => {
  console.log("\nAttempting to issue certificate...");

  try {
    const { studentName, courseName } = req.body;
    if (!studentName || !courseName) {
      return res
        .status(400)
        .json({ error: "studentName and courseName are required." });
    }

    // --- YOUR LOGIC GOES HERE ---

    // Example: Check wallet balance
    const balance = await provider.getBalance(wallet.address);
    const balanceInEth = ethers.formatEther(balance);
    console.log(`   Wallet balance: ${balanceInEth} ETH`);

    if (balanceInEth < 0.001) {
      console.warn(
        "   ⚠️ Warning: Wallet balance is very low. You may not have enough gas."
      );
    }

    // 1. Create a JSON object for the certificate
    const certificateData = {
      student: studentName,
      course: courseName,
      issuedOn: new Date().toISOString(),
      issuer: wallet.address,
    };

    // 2. Upload certificate JSON to IPFS
    console.log("   Uploading to IPFS...");
    const added = await ipfsClient.add(JSON.stringify(certificateData));
    const ipfsHash = added.path; // This is the CID (Content ID)
    console.log(`   Uploaded to IPFS. CID: ${ipfsHash}`);

    // 3. Call your smart contract (You will need to add your ABI and Address)
    // const contractAddress = "0x...";
    // const contractABI = [ ... ]; // Your contract's ABI
    // const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    // console.log("   Calling smart contract to issue on-chain...");
    // const tx = await contract.issue(studentName, ipfsHash);
    // await tx.wait(); // Wait for the transaction to be mined
    // console.log(`   Transaction mined! Hash: ${tx.hash}`);

    // --- End of logic ---

    // For now, we'll just send a success message.
    res.status(200).json({
      message: "Certificate issue endpoint hit successfully.",
      ipfsHash: ipfsHash,
      certificateData: certificateData,
      nextSteps: "Uncomment the smart contract code to issue on-chain.",
    });
  } catch (error) {
    console.error("   ❌ Error in issueCertificate:", error.message);
    res.status(500).json({ error: "Server error during certificate issue." });
  }
};
