const _chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const { ETHER_ADDRESS, EVM_REVERT, toWei } = require("../helpers");

const chai = _chai.use(chaiAsPromised);
const assert = chai.assert;
chai.should();

const GuilTokenContract = artifacts.require("./GuilToken");

contract("GuilToken", ([deployer, user1, user2, user3]) => {
  let contract;

  beforeEach(async () => {
    contract = await GuilTokenContract.new();
    await contract.transfer(user1, toWei(100), { from: deployer });
    await contract.approve(user2, toWei(100), { from: user1 });
  });

  it("it transfers a delegated amount to another address", async () => {
    await contract.transferFrom(user1, user3, toWei(30), { from: user2 });

    const user3Balance = await contract.balanceOf(user3);
    assert.equal(user3Balance.toString(), toWei(30));

    const allowance = await contract.allowance(user1, user2);
    assert.equal(allowance.toString(), toWei(70));
  });

  it("emits a Transfer event", async () => {
    const result = await contract.transferFrom(user1, user3, toWei(30), {
      from: user2,
    });
    const [log] = result.logs;

    assert.equal("Transfer", log.event);
    assert.equal(log.args.from, user1);
    assert.equal(log.args.to, user3);
    assert.equal(log.args.value.toString(), toWei(30));
  });

  it("rejects an invalid From address", async () => {
    await contract
      .transferFrom(ETHER_ADDRESS, user3, toWei(30), { from: user2 })
      .should.be.rejectedWith(EVM_REVERT);
  });

  it("rejects an invalid To address", async () => {
    await contract
      .transferFrom(user1, ETHER_ADDRESS, toWei(30), { from: user2 })
      .should.be.rejectedWith(EVM_REVERT);
  });

  it("rejects an amount greater than the allowance", async () => {
    await contract
      .transferFrom(user1, user3, toWei(200), { from: user2 })
      .should.be.rejectedWith(EVM_REVERT);
  });
});
