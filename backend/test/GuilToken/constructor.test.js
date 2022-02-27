import { assert } from "chai";
import { toWei } from "../helpers";

const GuilTokenContract = artifacts.require("./GuilToken");

contract("GuilToken", ([deployer]) => {
  const expectedName = "Guil Token";
  const expectedSymbol = "GUIL";
  const expectedBalance = toWei(1000000);
  let contract;

  beforeEach(async () => {
    contract = await GuilTokenContract.new();
  });

  describe("deployment", () => {
    it("tracks the name", async () => {
      const name = await contract.name();
      assert.equal(name, expectedName);
    });

    it("tracks the symbol", async () => {
      const symbol = await contract.symbol();
      assert.equal(symbol, expectedSymbol);
    });

    it("tracks the decimals", async () => {
      const decimals = await contract.decimals();
      assert.equal(decimals, 18);
    });

    it("tracks the total supply", async () => {
      const totalSupply = await contract.totalSupply();
      assert.equal(totalSupply.toString(), expectedBalance);
    });

    it("tracks the balance of the deployer", async () => {
      const balance = await contract.balanceOf(deployer);
      assert.equal(balance.toString(), expectedBalance);
    });
  });
});
