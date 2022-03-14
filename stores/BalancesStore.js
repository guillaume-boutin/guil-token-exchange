import BigNumber from "bignumber.js";
import { action, makeObservable, observable } from "mobx";
import { Token } from "../entities";

export class BalancesStore {
  /** @public {BigNumber|null} */ walletEthBalance = null;

  /** @public {BigNumber|null} */ exchangeEthBalance = null;

  /** @public {BigNumber|null} */ walletGuilBalance = null;

  /** @public {BigNumber|null} */ exchangeGuilBalance = null;

  constructor() {
    makeObservable(this, {
      walletEthBalance: observable,
      exchangeEthBalance: observable,
      walletGuilBalance: observable,
      exchangeGuilBalance: observable,
      setWalletEthBalance: action,
      setExchangeEthBalance: action,
      setWalletGuilBalance: action,
      setExchangeGuilBalance: action,
      addToWallet: action,
      addToExchange: action,
    });
  }

  /**
   * @param {BigNumber} value
   */
  setWalletEthBalance(value) {
    this.walletEthBalance = value;
  }

  /**
   * @param {BigNumber} value
   */
  setExchangeEthBalance(value) {
    this.exchangeEthBalance = value;
  }

  /**
   * @param {BigNumber} value
   */
  setWalletGuilBalance(value) {
    this.walletGuilBalance = value;
  }

  /**
   * @param {BigNumber} value
   */
  setExchangeGuilBalance(value) {
    this.exchangeGuilBalance = value;
  }

  /**
   * @param {Token} token
   */
  addToExchange(token) {
    if (token.isEth) {
      return this.setExchangeEthBalance(
        this.exchangeEthBalance.plus(token.amount)
      );
    }

    this.setExchangeGuilBalance(this.exchangeGuilBalance.plus(token.amount));
  }

  /**
   * @param {Token} token
   */
  addToWallet(token) {
    if (token.isEth) return;

    this.setWalletGuilBalance(this.walletGuilBalance.plus(token.amount));
  }
}
