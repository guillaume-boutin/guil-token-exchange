import { ETHER_ADDRESS } from "../helpers";

/**
 * @property {string} address
 * @property {string} amount
 */
export class Token {
  /**
   * @param props;
   * @param {string} props.address
   * @param {string} props.amount
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
    return parseFloat(this.amount) / 10 ** 18;
  }
}
