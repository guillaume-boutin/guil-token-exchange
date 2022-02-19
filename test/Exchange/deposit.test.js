import { assert } from "chai";
import { ETHER_ADDRESS, EVM_REVERT, toWei } from "../helpers";

const GuilToken = artifacts.require("./GuilToken");
const Exchange = artifacts.require("./Exchange");

contract("Exchange", ([deployer, feeAccount, user]) => {
  let exchange, guilToken;

  beforeEach(async () => {
    exchange = await Exchange.new(feeAccount, toWei(3.14));
    guilToken = await GuilToken.new();
    await guilToken.transfer(user, toWei(100), { from: deployer });
    await guilToken.approve(exchange.address, toWei(100), { from: user });
  });

  it("deposits tokens", async () => {
    await exchange.deposit(
      { contractAddress: guilToken.address, amount: toWei(100) },
      { from: user }
    );

    const balanceOf = await exchange.balanceOf(user, guilToken.address);
    assert.equal(balanceOf.toString(), toWei(100));
  });

  it("emits a Deposit event", async () => {
    const result = await exchange.deposit(
      { contractAddress: guilToken.address, amount: toWei(100) },
      {
        from: user,
      }
    );

    const [log] = result.logs;

    assert.equal(log.event, "Deposit");
    assert.equal(log.args.user, user);
    assert.equal(log.args.token.contractAddress, guilToken.address);
    assert.equal(log.args.token.amount, toWei(100));
    assert.equal(log.args.balance, toWei(100));
  });

  it("rejects an amount greater than the approval", async () => {
    try {
      await exchange.deposit(
        { contractAddress: guilToken.address, amount: toWei(200) },
        { from: user }
      );
      assert.fail(EVM_REVERT);
    } catch (e) {}
  });

  it("rejects deposits for Ether", async () => {
    try {
      await exchange.deposit(
        { contractAddress: ETHER_ADDRESS, amount: toWei(200) },
        { from: user }
      );
      assert.fail(EVM_REVERT);
    } catch (e) {}
  });
});
