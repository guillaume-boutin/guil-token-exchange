import { action, computed, makeObservable, observable } from "mobx";

export class Web3Store {
  sdk = null;

  /** @public {string|null} account */ account = null;

  exchangeContract = null;

  guilTokenContract = null;

  constructor() {
    makeObservable(this, {
      sdk: observable,
      account: observable,
      exchangeContract: observable,
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

  setSdk(sdk) {
    this.sdk = sdk;
  }

  setAccount(account) {
    this.account = account;
  }

  setExchangeContract(exchangeContract) {
    this.exchangeContract = exchangeContract;
  }

  setGuilTokenContract(guilTokenContract) {
    this.guilTokenContract = guilTokenContract;
  }
}
