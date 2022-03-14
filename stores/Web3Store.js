import { action, computed, makeObservable, observable } from "mobx";
import BigNumber from "bignumber.js";

export class Web3Store {
  sdk = null;

  /** @public {string|null} account */ account = null;

  exchangeContract = null;

  /** @private */ _exchangeFeePercent = null;

  /** @private */ _exchangeFeeAccount = null;

  guilTokenContract = null;

  constructor() {
    makeObservable(this, {
      sdk: observable,
      account: observable,
      exchangeContract: observable,
      exchangeContractAddress: computed,
      exchangeFeeRate: computed,
      exchangeFeeAccount: computed,
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
    if (!this._exchangeFeePercent) return null;

    return new BigNumber(this._exchangeFeePercent).shiftedBy(-4);
  }

  /**
   * @return {string|null}
   */
  get exchangeFeeAccount() {
    return this._exchangeFeeAccount;
  }

  setSdk(sdk) {
    this.sdk = sdk;
  }

  setAccount(account) {
    this.account = account;
  }

  async setExchangeContract(exchangeContract) {
    this.exchangeContract = exchangeContract;
    this._exchangeFeePercent = await exchangeContract.methods
      .feePercent()
      .call();

    this._exchangeFeeAccount = await exchangeContract.methods
      .feeAccount()
      .call();
  }

  setGuilTokenContract(guilTokenContract) {
    this.guilTokenContract = guilTokenContract;
  }
}
