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
    await exchange.placeOrder(
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
  });

  it("tracks a user's offers total balance", async () => {
    const balance = await exchange.offerBalance(user, guilToken.address);

    assert.equal(balance, toWei(50));
  });
});
