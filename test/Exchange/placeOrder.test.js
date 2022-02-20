import _chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { ETHER_ADDRESS, EVM_REVERT, toWei } from "../helpers";

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

  it("places an Order", async () => {
    await exchange.placeOrder(
      {
        contractAddress: guilToken.address,
        amount: toWei(80),
      },
      {
        contractAddress: ETHER_ADDRESS,
        amount: toWei(0.8),
      },
      { from: user }
    );

    const offerBalance = await exchange.offerBalance(user, guilToken.address);
    const balance = await exchange.balanceOf(user, guilToken.address);

    assert.equal(offerBalance, toWei(80));
    assert.equal(balance, toWei(20));
  });

  it("emits an Order event", async () => {
    const result = await exchange.placeOrder(
      {
        contractAddress: guilToken.address,
        amount: toWei(50),
      },
      {
        contractAddress: ETHER_ADDRESS,
        amount: toWei(0.8),
      },
      { from: user }
    );

    const [log] = result.logs;

    assert.equal(log.event, "Order");
    assert.equal(log.args.id, 1);
    assert.equal(log.args.user, user);
    assert.equal(log.args.offer.contractAddress, guilToken.address);
    assert.equal(log.args.offer.amount, toWei(50));
    assert.equal(log.args.demand.contractAddress, ETHER_ADDRESS);
    assert.equal(log.args.demand.amount, toWei(0.8));
  });

  it("rejects an order with a zero offer amount", async () => {
    await exchange
      .placeOrder(
        {
          contractAddress: guilToken.address,
          amount: toWei(0),
        },
        {
          contractAddress: ETHER_ADDRESS,
          amount: toWei(0.8),
        },
        { from: user }
      )
      .should.be.rejectedWith(EVM_REVERT);
  });

  it("rejects an order with a zero demand amount", async () => {
    await exchange
      .placeOrder(
        {
          contractAddress: guilToken.address,
          amount: toWei(50),
        },
        {
          contractAddress: ETHER_ADDRESS,
          amount: toWei(0),
        },
        { from: user }
      )
      .should.be.rejectedWith(EVM_REVERT);
  });

  it("rejects an offer amount above the user's balance", async () => {
    await exchange
      .placeOrder(
        {
          contractAddress: guilToken.address,
          amount: toWei(500),
        },
        {
          contractAddress: ETHER_ADDRESS,
          amount: toWei(0.8),
        },
        { from: user }
      )
      .should.be.rejectedWith(EVM_REVERT);
  });
});
