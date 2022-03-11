import { ETHER_ADDRESS } from "../helpers";
import BigNumber from "bignumber.js";

/**
 * @property {string} address
 * @property {BigNumber} amount
 */
export class Token {
  /**
   * @param props;
   * @param {string} props.address
   * @param {BigNumber} props.amount
   */
  constructor({ address, amount }) {
    this.address = address;
    this.amount = amount;
  }

  /**
   * @return {Token}
   */
  static null() {
    return new Token({ address: "", amount: new BigNumber(0) });
  }

  get isNull() {
    return this.address === "";
  }

  /**
   * @returns {boolean}
   */
  get isEth() {
    return this.address === ETHER_ADDRESS;
  }

  get unitaryAmount() {
    return this.amount.shiftedBy(-18);
  }

  /**
   * @param {Token} token
   * @return {boolean}
   */
  is(token) {
    return this.address === token.address;
  }

  /**
   * @param {Token} token
   * @return {Token}
   */
  plus(token) {
    if (!this.is(token)) throw "Cannot add 2 different tokens together";

    return new Token({
      address: this.address,
      amount: this.amount.plus(token.amount),
    });
  }

  /**
   * @param {Token} token
   * @return {Token}
   */
  minus(token) {
    if (!this.is(token)) throw "Cannot subtract 2 different tokens together";

    return new Token({
      address: this.address,
      amount: this.amount.minus(token.amount),
    });
  }

  /**
   * @param {BigNumber} n
   * @return {Token}
   */
  times(n) {
    return new Token({ address: this.address, amount: this.amount.times(n) });
  }

  /**
   * @return {Token}
   */
  negated() {
    return new Token({ address: this.address, amount: this.amount.negated() });
  }
}

export class TokenFactory {
  /**
   * @param returnValues
   * @return {Token}
   */
  fromExchangeTransferEvent(returnValues) {
    return new Token({
      address: returnValues.token.contractAddress,
      amount: new BigNumber(returnValues.token.amount),
    });
  }
}
