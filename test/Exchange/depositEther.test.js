import { assert } from "chai";
import { ETHER_ADDRESS, EVM_REVERT, toWei } from "../helpers";

const Exchange = artifacts.require("./Exchange");

contract("Exchange", ([deployer, feeAccount, user]) => {
  let exchange, guilToken;

  beforeEach(async () => {
    exchange = await Exchange.new(feeAccount, toWei(3.14));
  });

  it("deposits ether", async () => {
    await exchange.depositEther(
      { contractAddress: ETHER_ADDRESS, amount: toWei(1) },
      { from: user }
    );
    const balance = await exchange.balanceOf(user, ETHER_ADDRESS);

    assert.equal(balance.toString(), toWei(1));
  });

  it("emits a Deposit event", async () => {
    const result = await exchange.depositEther(
      { contractAddress: ETHER_ADDRESS, amount: toWei(1) },
      { from: user }
    );

    const [log] = result.logs;

    assert.equal(log.event, "Deposit");
    assert.equal(log.args.user, user);
    assert.equal(log.args.token.contractAddress, ETHER_ADDRESS);
    assert.equal(log.args.token.amount, toWei(1));
    assert.equal(log.args.balance, toWei(1));
  });

  it("rejects non Ether tokens", async () => {
    try {
      await exchange.depositEther({
        contractAddress: ETHER_ADDRESS,
        amount: toWei(1),
      });
      assert.fail(EVM_REVERT);
    } catch (e) {}
  });
});
