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
   * @returns {boolean}
   */
  get isEth() {
    return this.address === ETHER_ADDRESS;
  }

  get unitaryAmount() {
    // if (!this.amount) {
    //   return new BigNumber(666);
    // }

    return this.amount.shiftedBy(-18);
  }
}
