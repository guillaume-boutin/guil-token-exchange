const _chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const { ETHER_ADDRESS, EVM_REVERT, toWei } = require("../helpers");

const chai = _chai.use(chaiAsPromised);
const assert = chai.assert;
chai.should();

const Exchange = artifacts.require("./Exchange");

contract("Exchange", ([deployer, feeAccount, user]) => {
  let exchange, guilToken;

  beforeEach(async () => {
    exchange = await Exchange.new(feeAccount, toWei(3.14));
    await exchange.depositEther({ from: user, value: toWei(1) });
  });

  it("withdraws tokens", async () => {
    const userInitialBalance = await web3.eth.getBalance(user);

    await exchange.withdrawEther(toWei(0.3), { from: user });

    const userFinalBalance = await web3.eth.getBalance(user);

    const balance = await exchange.balanceOf(user, ETHER_ADDRESS);

    assert.equal(balance.toString(), toWei(0.7));
    assert.isTrue(userFinalBalance - userInitialBalance <= toWei(0.3));
  });

  it("emits a Withdraw event", async () => {
    const result = await exchange.withdrawEther(toWei(0.3), { from: user });

    const [log] = result.logs;
    assert.equal(log.event, "Withdraw");
    assert.equal(log.args.user, user);
    assert.equal(log.args.token.contractAddress, ETHER_ADDRESS);
    assert.equal(log.args.token.amount, toWei(0.3));
    assert.equal(log.args.balance, toWei(0.7));
  });

  it("rejects amounts greater than the balance", async () => {
    await exchange
      .withdrawEther(toWei(10), { from: user })
      .should.be.rejectedWith(EVM_REVERT);
  });
});
