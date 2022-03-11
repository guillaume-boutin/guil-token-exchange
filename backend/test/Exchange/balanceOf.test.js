const { assert } = require("chai");
const { ETHER_ADDRESS, toWei } = require("../helpers");

const Exchange = artifacts.require("./Exchange");
const GuilToken = artifacts.require("./GuilToken");

contract("Exchange", ([deployer, feeAccount, user]) => {
  let exchange, guilToken;

  beforeEach(async () => {
    guilToken = await GuilToken.new();
    exchange = await Exchange.new(feeAccount, toWei(3.14));
  });

  it("tracks the balance of tokens for a user", async () => {
    await guilToken.transfer(user, toWei(100), { from: deployer });
    await guilToken.approve(exchange.address, toWei(100), { from: user });
    await exchange.deposit(
      { contractAddress: guilToken.address, amount: toWei(85) },
      { from: user }
    );
    let balance = await exchange.balanceOf(user, guilToken.address);

    assert.equal(balance, toWei(85));
  });

  it("tracks the balance of eth for a user", async () => {
    await exchange.depositEther({ from: user, value: toWei(0.65) });
    let balance = await exchange.balanceOf(user, ETHER_ADDRESS);

    assert.equal(balance, toWei(0.65));
  });
});
