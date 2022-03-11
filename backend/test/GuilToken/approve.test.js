const _chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const { ETHER_ADDRESS, EVM_REVERT, toWei } = require("../helpers");

const chai = _chai.use(chaiAsPromised);
const assert = chai.assert;
chai.should();

const GuilTokenContract = artifacts.require("./GuilToken");

contract("GuilToken", ([deployer, user1, user2]) => {
  let contract;

  beforeEach(async () => {
    contract = await GuilTokenContract.new();
    await contract.transfer(user1, toWei(100), { from: deployer });
  });

  it("allocates an allowance for delegated spending", async () => {
    await contract.approve(user2, toWei(30), { from: user1 });

    const allowance = await contract.allowance(user1, user2);
    const balance = await contract.balanceOf(user1);

    assert.equal(toWei(30), allowance.toString());
    assert.equal(toWei(70), balance.toString());
  });

  it("emits an Approve event", async () => {
    const result = await contract.approve(user2, toWei(30), { from: user1 });
    const [log] = result.logs;

    assert.equal("Approve", log.event);
    assert.equal(user1, log.args.from);
    assert.equal(user2, log.args.to);
    assert.equal(toWei(30), log.args.value.toString());
  });

  it("rejects an amount greater than the owned balance", async () => {
    await contract
      .approve(user2, toWei(150), { from: user1 })
      .should.be.rejectedWith(EVM_REVERT);
  });

  it("rejects an invalid address", async () => {
    await contract
      .approve(ETHER_ADDRESS, toWei(150), { from: user1 })
      .should.be.rejectedWith(EVM_REVERT);
  });
});
