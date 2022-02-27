const Exchange = artifacts.require("Exchange");

module.exports = async function (deployer) {
  const [feeAccount] = await web3.eth.getAccounts();
  const feePercent = 272;

  await deployer.deploy(Exchange, feeAccount, feePercent);
};
