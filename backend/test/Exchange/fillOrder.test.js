import _chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { ETHER_ADDRESS, EVM_REVERT, toWei } from "../helpers";

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
    await exchange.depositEther({ from: user1, value: toWei(1) });
    const result = await exchange.placeOrder(
      {
        contractAddress: ETHER_ADDRESS,
        amount: toWei(0.7),
      },
      {
        contractAddress: guilToken.address,
        amount: toWei(70),
      },
      { from: user1 }
    );

    orderId = result.logs[0].args.id.toString();

    await guilToken.transfer(user2, toWei(100), { from: deployer });
    await guilToken.approve(exchange.address, toWei(100), { from: user2 });
    await exchange.deposit(
      { contractAddress: guilToken.address, amount: toWei(100) },
      { from: user2 }
    );
  });

  it("fills the order", async () => {
    await exchange.fillOrder(orderId, { from: user2 });

    const sellerEthBalance = await exchange.offerBalance(user1, ETHER_ADDRESS);
    assert.equal(sellerEthBalance.toString(), 0);

    const sellerGuilBalance = await exchange.balanceOf(
      user1,
      guilToken.address
    );
    assert.equal(sellerGuilBalance.toString(), toWei(70));

    const buyerGuilBalance = await exchange.balanceOf(user2, guilToken.address);
    assert.equal(buyerGuilBalance.toString(), toWei(30));

    const buyerEthBalance = await exchange.balanceOf(user2, ETHER_ADDRESS);
    assert.equal(buyerEthBalance.toString(), toWei(0.7 - (0.7 * 3.14) / 100));

    const feeAmount = await exchange.balanceOf(feeAccount, ETHER_ADDRESS);
    assert.equal(feeAmount.toString(), toWei((0.7 * 3.14) / 100));
  });

  it("emits a Trade event", async () => {
    const result = await exchange.fillOrder(orderId, { from: user2 });

    const [log] = result.logs;

    assert.equal(log.event, "Trade");
    assert.equal(log.args.order.id.toString(), orderId);
  });

  it("rejects if the taker's balance is insufficient", async () => {
    await exchange
      .fillOrder(orderId, { from: user3 })
      .should.be.rejectedWith(EVM_REVERT);
  });

  it("rejects if the order isn't open", async () => {
    await exchange.cancelOrder(orderId, { from: user1 });

    await exchange
      .fillOrder(orderId, { from: user2 })
      .should.be.rejectedWith(EVM_REVERT);
  });

  it("rejects if the buyer is also the seller", async () => {
    await exchange
      .fillOrder(orderId, { from: user1 })
      .should.be.rejectedWith(EVM_REVERT);
  });
});
