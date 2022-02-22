import _chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { ETHER_ADDRESS, EVM_REVERT, toWei } from "../helpers";

const chai = _chai.use(chaiAsPromised);
const assert = chai.assert;
chai.should();

const GuilToken = artifacts.require("./GuilToken");
const Exchange = artifacts.require("./Exchange");

contract("Exchange", ([deployer, feeAccount, user1, user2]) => {
  let exchange, guilToken, orderId;

  beforeEach(async () => {
    exchange = await Exchange.new(feeAccount, toWei(3.14));
    guilToken = await GuilToken.new();
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

    orderId = result.logs[0].args.id;
  });

  it("cancels an order", async () => {
    await exchange.cancelOrder(orderId, { from: user1 });
    const result = await exchange.cancelledOrder(orderId);
    const cancelledOrder = await exchange.cancelledOrder(orderId);
    const openOrder = await exchange.openOrder(orderId);

    assert.equal(result.id, orderId);
    assert.equal(cancelledOrder.id, orderId);
    assert.equal(openOrder.id, 0);

    const offerBalance = await exchange.offerBalance(user1, guilToken.address);
    assert.equal(offerBalance.toString(), 0);

    const balance = await exchange.balanceOf(user1, guilToken.address);
    assert.equal(balance.toString(), toWei(100));
  });

  it("emits a Cancel event", async () => {
    const result = await exchange.cancelOrder(orderId, { from: user1 });

    const [log] = result.logs;

    assert.equal(log.event, "Cancel");
    assert.equal(log.args.order.id, orderId);
  });

  it("rejects for an order already cancelled", async () => {
    await exchange.cancelOrder(orderId, { from: user1 });

    await exchange
      .cancelOrder(orderId, { from: user1 })
      .should.be.rejectedWith(EVM_REVERT);
  });

  it("rejects for an order that doesn't belong to the user", async () => {
    await exchange
      .cancelOrder(orderId, { from: user2 })
      .should.be.rejectedWith(EVM_REVERT);
  });
});
