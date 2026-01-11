// ethreum
// require("@nomicfoundation/hardhat-toolbox");
// require('dotenv').config();

// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: "0.8.19",
//   networks: {
//     sepolia: {
//       url: process.env.ETHEREUM_RPC_URL,
//       accounts: [process.env.PRIVATE_KEY]
//     }
//   }
// };

//solana
// require("@nomicfoundation/hardhat-toolbox");
// require("dotenv").config();

// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: "0.8.19",
//   networks: {
//     sepolia: {
//       url:
//         process.env.ETHEREUM_RPC_URL ||
//         "https://ethereum-sepolia-rpc.publicnode.com",
//       accounts: [process.env.PRIVATE_KEY],
//     },
//     // ✅ NEON DEVNET (Clean Config)
//     neondevnet: {
//       url: "https://devnet.neonevm.org", // Official URL
//       accounts: [process.env.PRIVATE_KEY],
//       chainId: 245022926,
//       timeout: 300000, // 5 minutes (to handle network lag)
//     },
//   },
// };
//
//
// polygon
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url:
        process.env.ETHEREUM_RPC_URL ||
        "https://ethereum-sepolia-rpc.publicnode.com",
      accounts: [process.env.PRIVATE_KEY],
    },
    // ✅ POLYGON AMOY (Stable & Fast)
    amoy: {
      url: "https://rpc-amoy.polygon.technology/",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 80002,
    },
  },
};
