require("babel-register");
require("babel-polyfill");
require("dotenv").config();

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
  },
  contracts_directory: "./contracts/",
  contracts_build_directory: "./abis/",
  migrations_directory: "./migrations/",

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