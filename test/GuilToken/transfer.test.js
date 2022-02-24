import _chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { ETHER_ADDRESS, EVM_REVERT, toWei } from "../helpers";

const chai = _chai.use(chaiAsPromised);
const assert = chai.assert;
chai.should();

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

    assert.equal(toWei(transferAmount), userBalance.toString());
    assert.equal(
      toWei(totalBalance - transferAmount),
      deployerBalance.toString()
    );
  });

  it("emits a Transfer event", async () => {
    const transferAmount = 100;

    const result = await contract.transfer(user, toWei(transferAmount), {
      from: deployer,
    });

    const [log] = result.logs;

    assert.equal(log.event, "Transfer");
    assert.equal(log.args.from, deployer);
    assert.equal(log.args.to, user);
    assert.equal(log.args.value.toString(), toWei(transferAmount));
  });

  it("should reject a transfer when sender has insufficient funds", async () => {
    const transferAmount = totalBalance * 2;

    await contract
      .transfer(user, toWei(transferAmount), {
        from: deployer,
      })
      .should.be.rejectedWith(EVM_REVERT);
  });

  it("should reject invalid recipient address", async () => {
    const transferAmount = 100;

    await contract
      .transfer(ETHER_ADDRESS, toWei(transferAmount), {
        from: deployer,
      })
      .should.be.rejectedWith(EVM_REVERT);
  });

  it("should reject a transfer when amount is 0", async () => {
    const transferAmount = 0;

    await contract
      .transfer(user, toWei(0), {
        from: deployer,
      })
      .should.be.rejectedWith(EVM_REVERT);
  });
});
