const web3 = require("web3");

const EVM_REVERT = "VM Exception while processing transaction: revert";

const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";

const toWei = (n) => {
  return web3.utils.toWei(n.toString(), "ether");
};

const ether = (n) => {
  return web3.utils.toWei(n.toString(), "ether");
};

const tokens = (n) => ether(n);

module.exports = {
  EVM_REVERT,
  ETHER_ADDRESS,
  toWei,
  ether,
  tokens,
};
