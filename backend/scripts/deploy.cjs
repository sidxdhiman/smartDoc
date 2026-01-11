// ethreum
// import hre from "hardhat";

// async function main() {
//   const DocumentRegistry = await hre.ethers.getContractFactory(
//     "DocumentRegistry"
//   );
//   const documentRegistry = await DocumentRegistry.deploy();

//   await documentRegistry.waitForDeployment();

//   console.log(
//     "DocumentRegistry deployed to:",
//     await documentRegistry.getAddress()
//   );
// }

// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

// solana //renamed to deploy.cjs - rename to .js to run ethereum
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("----------------------------------------------------");
  console.log("Deploying contracts with the account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "POL");
  console.log("----------------------------------------------------");

  if (balance === 0n) {
    throw new Error("❌ This account has 0 POL! Check your .env PRIVATE_KEY.");
  }

  const DocumentRegistry = await hre.ethers.getContractFactory(
    "DocumentRegistry"
  );
  const registry = await DocumentRegistry.deploy();
  await registry.waitForDeployment();

  console.log("✅ DocumentRegistry deployed to:", registry.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
