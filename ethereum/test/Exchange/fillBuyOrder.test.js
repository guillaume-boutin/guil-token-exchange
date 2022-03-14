const _chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const { ETHER_ADDRESS, EVM_REVERT, toWei } = require("../helpers");

const chai = _chai.use(chaiAsPromised);
const assert = chai.assert;
chai.should();

const GuilToken = artifacts.require("./GuilToken");
const Exchange = artifacts.require("./Exchange");

contract("Exchange", ([deployer, feeAccount, user1, user2, user3]) => {
  let exchange, guilToken, orderId;

  beforeEach(async () => {
    exchange = await Exchange.new(feeAccount, 314);
    guilToken = await GuilToken.new();

    await exchange.depositEther({ from: user2, value: toWei(1) });

    await guilToken.transfer(user1, toWei(100), { from: deployer });
    await guilToken.approve(exchange.address, toWei(100), { from: user1 });
    await exchange.deposit(
      { contractAddress: guilToken.address, amount: toWei(100) },
      { from: user1 }
    );

    const result = await exchange.placeOrder(
      {
        contractAddress: guilToken.address,
        amount: toWei(70),
      },
      {
        contractAddress: ETHER_ADDRESS,
        amount: toWei(0.7),
      },
      { from: user1 }
    );

    orderId = result.logs[0].args.id.toString();
  });

  it("fills the order", async () => {
    await exchange.fillOrder(orderId, { from: user2 });

    const takerGuilBalance = await exchange.balanceOf(user2, guilToken.address);
    assert.equal(takerGuilBalance.toString(), toWei(70 - (70 * 3.14) / 100));

    // const buyerGuilBalance = await exchange.balanceOf(user2, guilToken.address);
    // assert.equal(buyerGuilBalance.toString(), toWei(30));
    //
    // const buyerEthBalance = await exchange.balanceOf(user2, ETHER_ADDRESS);
    // assert.equal(buyerEthBalance.toString(), toWei(0.7 - (0.7 * 3.14) / 100));
    //
    // const feeAmount = await exchange.balanceOf(feeAccount, ETHER_ADDRESS);
    // assert.equal(feeAmount.toString(), toWei((0.7 * 3.14) / 100));
  });
});
