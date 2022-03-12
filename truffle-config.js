require("babel-register");
require("babel-polyfill");
require("dotenv").config();
const HDWalletProvider = require("truffle-hdwallet-provider-privkey");
const privateKeys = process.env.PRIVATE_KEYS || "";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    kovan: {
      provider: function () {
        return new HDWalletProvider(
          privateKeys.split(","),
          `https://kovan.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
        );
      },
      gas: 5000000,
      gasPrice: 25000000000,
      network_id: 42,
    },
  },
  contracts_directory: "./ethereum/contracts/",
  contracts_build_directory: "./ethereum/abis/",
  migrations_directory: "./ethereum/migrations/",

  // Configure your compilers
  compilers: {
    solc: {
      version: "^0.8.0",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
};
