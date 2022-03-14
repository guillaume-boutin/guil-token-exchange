import { action, computed, makeObservable, observable } from "mobx";
import BigNumber from "bignumber.js";

export class Web3Store {
  sdk = null;

  /** @public {string|null} account */ account = null;

  exchangeContract = null;

  /** @private */ exchangeFeePercent = null;

  guilTokenContract = null;

  constructor() {
    makeObservable(this, {
      sdk: observable,
      account: observable,
      exchangeContract: observable,
      exchangeContractAddress: computed,
      exchangeFeeRate: computed,
      guilTokenContract: observable,
      guilTokenContractAddress: computed,
      setSdk: action,
      setAccount: action,
      setExchangeContract: action,
      setGuilTokenContract: action,
    });
  }

  /**
   * @return {string|null}
   */
  get guilTokenContractAddress() {
    return this.guilTokenContract?.options.address;
  }

  /**
   * @return {string|null}
   */
  get exchangeContractAddress() {
    return this.exchangeContract?.options.address;
  }

  /**
   * @return {BigNumber|null}
   */
  get exchangeFeeRate() {
    if (!this.exchangeFeePercent) return null;

    return new BigNumber(this.exchangeFeePercent).shiftedBy(-4);
  }

  setSdk(sdk) {
    this.sdk = sdk;
  }

  setAccount(account) {
    this.account = account;
  }

  async setExchangeContract(exchangeContract) {
    this.exchangeContract = exchangeContract;
    this.exchangeFeePercent = await exchangeContract.methods
      .feePercent()
      .call();
  }

  setGuilTokenContract(guilTokenContract) {
    this.guilTokenContract = guilTokenContract;
  }
}
