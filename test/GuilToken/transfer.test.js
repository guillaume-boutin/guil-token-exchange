import { assert } from "chai";
import { EVM_REVERT, toWei } from "../helpers";

const GuilTokenContract = artifacts.require("./GuilToken");

contract("GuilToken", ([deployer, user]) => {
  const totalBalance = 1000000;
  let contract;

  beforeEach(async () => {
    contract = await GuilTokenContract.new();
  });

  it("can transfer from an address to another", async () => {
    const transferAmount = 100;

    await contract.transfer(user, toWei(transferAmount), { from: deployer });

    const deployerBalance = await contract.balanceOf(deployer);
    const userBalance = await contract.balanceOf(user);

    assert.equal(userBalance.toString(), toWei(transferAmount));
    assert.equal(
      deployerBalance.toString(),
      toWei(totalBalance - transferAmount)
    );
  });

  it("should reject a transfer when sender has insufficient funds", async () => {
    const transferAmount = totalBalance * 2;

    try {
      await contract.transfer(user, toWei(transferAmount), {
        from: deployer,
      });
      assert.fail(EVM_REVERT);
    } catch (err) {}
  });

  it("should reject a transfer when receiving address doesn't exist", async () => {
    const transferAmount = 100;

    try {
      await contract.transfer("bad_address", toWei(transferAmount), {
        from: deployer,
      });
      assert.fail(EVM_REVERT);
    } catch (err) {}
  });

  it("should reject a transfer when amount is 0", async () => {
    const transferAmount = 0;

    try {
      await contract.transfer("bad_address", toWei(transferAmount), {
        from: deployer,
      });
      assert.fail(EVM_REVERT);
    } catch (err) {}
  });
});
