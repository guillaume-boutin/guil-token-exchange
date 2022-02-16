const web3 = require("web3");

export const EVM_REVERT = "VM Exception while processing transaction: revert";

export const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";

export const toWei = (n) => {
  return web3.utils.toWei(n.toString(), "ether");
};

export const ether = (n) => {
  return web3.utils.toWei(n.toString(), "ether");
};

export const tokens = (n) => ether(n);
