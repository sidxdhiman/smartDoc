import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;
import "dotenv/config";

async function main() {
  console.log("Starting system test...");

  // 1. Connect to the deployed contract
  const contractAddress = process.env.REGISTRY_CONTRACT_ADDRESS;
  const DocumentRegistry = await ethers.getContractFactory("DocumentRegistry");
  const registry = DocumentRegistry.attach(contractAddress);

  console.log("Connected to DocumentRegistry at:", contractAddress);

  // 2. Test document registration
  const testDocument = "Hello World"; // Sample document content
  const documentHash = ethers.id(testDocument);
  const mockIpfsHash = "QmTest123"; // Sample IPFS hash

  console.log("Registering document...");
  const tx = await registry.registerDocument(documentHash, mockIpfsHash);
  await tx.wait();
  console.log("Document registered. Transaction hash:", tx.hash);

  // 3. Test document verification
  console.log("Verifying document...");
  const isVerified = await registry.verifyDocument(documentHash);
  console.log("Document verification result:", isVerified);

  expect(isVerified).to.be.true;
  console.log("Test completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
