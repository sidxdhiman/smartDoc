import { ethers } from "ethers";
import { create } from "ipfs-http-client";
import Request from "../models/Request.js"; // ✅ Import the request model
import "dotenv/config"; // Make sure .env is loaded

// ============================================================
//              1. SETUP FOR ETHERS & IPFS
// ============================================================
const myKey = process.env.PRIVATE_KEY;
const rpcUrl = process.env.SEPOLIA_RPC_URL;
const ipfsProjectId = process.env.IPFS_PROJECT_ID;
const ipfsProjectSecret = process.env.IPFS_PROJECT_SECRET;

if (!myKey || !rpcUrl || !ipfsProjectId || !ipfsProjectSecret) {
  console.error(
    "❌ Missing required environment variables for issue controller."
  );
  process.exit(1);
}

console.log(`✅ Connecting to Sepolia via: ${rpcUrl.substring(0, 30)}...`);

const provider = new ethers.JsonRpcProvider(rpcUrl);
const wallet = new ethers.Wallet(myKey, provider);
console.log(`✅ Ethers wallet loaded. Address: ${wallet.address}`);

const auth =
  "Basic " +
  Buffer.from(ipfsProjectId + ":" + ipfsProjectSecret).toString("base64");

const ipfsClient = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: { authorization: auth },
});

console.log("✅ IPFS client connected to Infura.");

// ============================================================
//              2. ISSUE CERTIFICATE ENDPOINT
// ============================================================

export const issueCertificate = async (req, res) => {
  console.log("\n📜 Attempting to issue certificate...");

  try {
    // ✅ Check if logged in and role is issuer
    if (!req.user || req.user.role !== "issuer") {
      return res.status(403).json({ message: "Access denied. Issuers only." });
    }

    const { studentName, courseName } = req.body;

    if (!studentName || !courseName) {
      return res
        .status(400)
        .json({ error: "studentName and courseName are required." });
    }

    // --- Example: check wallet balance ---
    const balance = await provider.getBalance(wallet.address);
    const balanceInEth = ethers.formatEther(balance);
    console.log(`   Wallet balance: ${balanceInEth} ETH`);

    // --- Create a JSON object for the certificate ---
    const certificateData = {
      student: studentName,
      course: courseName,
      issuedOn: new Date().toISOString(),
      issuer: req.user.name || wallet.address,
    };

    // --- Upload certificate JSON to IPFS ---
    console.log("   Uploading to IPFS...");
    const added = await ipfsClient.add(JSON.stringify(certificateData));
    const ipfsHash = added.path;
    console.log(`   Uploaded to IPFS. CID: ${ipfsHash}`);

    // TODO: On-chain contract call (optional)
    // const contract = new ethers.Contract(contractAddress, contractABI, wallet);
    // const tx = await contract.issue(studentName, ipfsHash);
    // await tx.wait();

    return res.status(200).json({
      message: "✅ Certificate issued successfully",
      ipfsHash,
      certificateData,
    });
  } catch (error) {
    console.error("❌ Error in issueCertificate:", error);
    res.status(500).json({ error: "Server error during certificate issue." });
  }
};

// ============================================================
//              3. GET ALL REQUESTS FOR ISSUERS
// ============================================================

export const getAllRequests = async (req, res) => {
  try {
    console.log("\n📥 Fetching all document requests for issuer...");

    // ✅ Only issuers can view this
    if (!req.user || req.user.role !== "issuer") {
      console.warn("Unauthorized access attempt to issuer requests.");
      return res.status(403).json({ message: "Access denied. Issuers only." });
    }

    const requests = await Request.find().sort({ createdAt: -1 });

    console.log(`✅ Found ${requests.length} requests.`);
    res.status(200).json({ requests });
  } catch (error) {
    console.error("❌ Error fetching issuer requests:", error);
    res.status(500).json({ message: "Failed to fetch issuer requests." });
  }
};
