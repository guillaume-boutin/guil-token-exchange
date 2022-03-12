const { assert } = require("chai");
const { ETHER_ADDRESS, EVM_REVERT, toWei } = require("../helpers");

const Exchange = artifacts.require("./Exchange");

contract("Exchange", ([deployer, feeAccount, user]) => {
  let exchange;

  beforeEach(async () => {
    exchange = await Exchange.new(feeAccount, toWei(3.14));
  });

  it("deposits ether", async () => {
    const userBeforeBalance = await web3.eth.getBalance(user);
    await exchange.depositEther({ from: user, value: toWei(1) });
    const userAfterBalance = await web3.eth.getBalance(user);
    const balance = await exchange.balanceOf(user, ETHER_ADDRESS);
    const contractBalance = await web3.eth.getBalance(exchange.address);

    assert.equal(balance.toString(), toWei(1));
    assert.isTrue(userBeforeBalance - userAfterBalance >= toWei(1));
    assert.equal(contractBalance.toString(), toWei(1));
  });

  it("emits a Deposit event", async () => {
    const result = await exchange.depositEther({ from: user, value: toWei(1) });

    const [log] = result.logs;

    assert.equal(log.event, "Deposit");
    assert.equal(log.args.user, user);
    assert.equal(log.args.token.contractAddress, ETHER_ADDRESS);
    assert.equal(log.args.token.amount, toWei(1));
    assert.equal(log.args.balance, toWei(1));
  });
});
