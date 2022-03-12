const _chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const { EVM_REVERT, toWei } = require("../helpers");

const chai = _chai.use(chaiAsPromised);
const assert = chai.assert;
chai.should();

const GuilToken = artifacts.require("./GuilToken");
const Exchange = artifacts.require("./Exchange");

contract("Exchange", ([deployer, feeAccount, user]) => {
  let exchange, guilToken;

  beforeEach(async () => {
    exchange = await Exchange.new(feeAccount, toWei(3.14));
    guilToken = await GuilToken.new();
    await guilToken.transfer(user, toWei(100), { from: deployer });
    await guilToken.approve(exchange.address, toWei(100), { from: user });
    await exchange.deposit(
      { contractAddress: guilToken.address, amount: toWei(100) },
      { from: user }
    );
  });

  it("withdraws tokens", async () => {
    await exchange.withdraw(
      {
        contractAddress: guilToken.address,
        amount: toWei(30),
      },
      { from: user }
    );
    const exchangeBalance = await exchange.balanceOf(user, guilToken.address);
    const guilBalance = await guilToken.balanceOf(user);

    assert.equal(exchangeBalance.toString(), toWei(70));
    assert.equal(guilBalance.toString(), toWei(30));
  });

  it("emits a Withdraw event", async () => {
    const result = await exchange.withdraw(
      { contractAddress: guilToken.address, amount: toWei(30) },
      {
        from: user,
      }
    );
    const [log] = result.logs;
    assert.equal(log.event, "Withdraw");
    assert.equal(log.args.user, user);
    assert.equal(log.args.token.contractAddress, guilToken.address);
    assert.equal(log.args.token.amount, toWei(30));
    assert.equal(log.args.balance, toWei(70));
  });

  it("rejects amounts greater than the balance", async () => {
    await exchange
      .withdraw(
        { contractAddress: guilToken.address, amount: toWei(200) },
        {
          from: user,
        }
      )
      .should.be.rejectedWith(EVM_REVERT);
  });
});
