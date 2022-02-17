import { assert } from "chai";
import { EVM_REVERT, toWei } from "../helpers";

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
    try {
      await contract.transferFrom(0x0, user3, toWei(30), { from: user2 });
      assert.fail(EVM_REVERT);
    } catch (e) {}
  });

  it("rejects an invalid To address", async () => {
    try {
      await contract.transferFrom(user1, 0x0, toWei(30), { from: user2 });
      assert.fail(EVM_REVERT);
    } catch (e) {}
  });

  it("rejects an amount greater than the allowance", async () => {
    try {
      await contract.transferFrom(user1, user3, toWei(200), { from: user2 });
      assert.fail(EVM_REVERT);
    } catch (e) {}
  });
});
