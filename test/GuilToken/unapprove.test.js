import _chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { ETHER_ADDRESS, EVM_REVERT, toWei } from "../helpers";

const chai = _chai.use(chaiAsPromised);
const assert = chai.assert;
chai.should();

const GuilTokenContract = artifacts.require("./GuilToken");

contract("GuilToken", ([deployer, user1, user2]) => {
  let contract;

  beforeEach(async () => {
    contract = await GuilTokenContract.new();
    await contract.transfer(user1, toWei(100), { from: deployer });
    await contract.approve(user2, toWei(100), { from: user1 });
  });

  it("takes back a previously allocated amount", async () => {
    await contract.unapprove(user2, toWei(30), { from: user1 });

    const allowance = await contract.allowance(user1, user2);
    assert.equal(allowance.toString(), toWei(70));

    const balance = await contract.balanceOf(user1);
    assert.equal(balance.toString(), toWei(30));
  });

  it("emits an Unapprove event", async () => {
    const result = await contract.unapprove(user2, toWei(30), { from: user1 });
    const [log] = result.logs;

    assert.equal("Unapprove", log.event);
    assert.equal(user1, log.args.from);
    assert.equal(user2, log.args.to);
    assert.equal(toWei(30), log.args.value.toString());
  });

  it("rejects an amount greater than current allocation", async () => {
    await contract
      .unapprove(user2, toWei(200), { from: user1 })
      .should.be.rejectedWith(EVM_REVERT);
  });

  it("rejects an invalid address", async () => {
    await contract
      .unapprove(ETHER_ADDRESS, toWei(200), { from: user1 })
      .should.be.rejectedWith(EVM_REVERT);
  });
});
