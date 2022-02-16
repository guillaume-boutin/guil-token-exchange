const GuilToken = artifacts.require("GuilToken");

module.exports = async function (deployer) {
  await deployer.deploy(GuilToken);
};
