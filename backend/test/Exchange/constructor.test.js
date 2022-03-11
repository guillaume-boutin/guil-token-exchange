const { assert } = require("chai");
const { toWei } = require("../helpers");

const ExchangeContract = artifacts.require("./Exchange");

contract("Exchange", ([deployer, feeAccount]) => {
  it("tracks the fee account", async () => {
    const contract = await ExchangeContract.new(feeAccount, toWei(3.14));
    const trackedFeeAccount = await contract.feeAccount();

    assert.equal(trackedFeeAccount, feeAccount);
  });

  it("tracks the fee percent", async () => {
    const contract = await ExchangeContract.new(feeAccount, toWei(3.14));
    const trackedFeePercent = await contract.feePercent();

    assert.equal(trackedFeePercent.toString(), toWei(3.14));
  });
});
