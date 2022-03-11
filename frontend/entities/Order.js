import { Token } from "./Token";
import moment from "moment";
import BigNumber from "bignumber.js";

/**
 * @property {string} id;
 * @property {string} user;
 * @property {Token} offer;
 * @property {Token} demand;
 * @property {number} timestamp;
 */
export class Order {
  /**
   * @param props
   * @param props.id {string}
   * @param props.user {string}
   * @param props.offer {Token}
   * @param props.demand {Token}
   * @param props.timestamp {number}
   */
  constructor({ id, user, offer, demand, timestamp }) {
    this._id = id;
    this.user = user;
    this.offer = offer;
    this.demand = demand;
    this._timestamp = timestamp;
  }

  /**
   * @return {number}
   */
  get id() {
    return this._id;
  }

  /**
   * @return {"buy"|"sell"}
   */
  get transactionType() {
    return this.offer.isEth ? "sell" : "buy";
  }

  /**
   * @return {boolean}
   */
  get isBuy() {
    return !this.offer.isEth;
  }

  /**
   * @return {boolean}
   */
  get isSell() {
    return this.offer.isEth;
  }

  /**
   * @return {Token}
   */
  get ether() {
    return this.offer.isEth ? this.offer : this.demand;
  }

  /**
   * @return {Token}
   */
  get token() {
    return this.offer.isEth ? this.demand : this.offer;
  }

  /**
   * @return {BigNumber}
   */
  get price() {
    return this.ether.amount.dividedBy(this.token.amount);
  }

  /**
   * @return {moment.Moment}
   */
  get timestamp() {
    return moment.unix(this._timestamp);
  }
}

export class OrderFactory {
  /**
   * @returns {Order}
   */
  fromEventValues({ id, user, offer, demand, timestamp }) {
    return new Order({
      id,
      user,
      offer: new Token({
        address: offer.contractAddress,
        amount: new BigNumber(offer.amount),
      }),
      demand: new Token({
        address: demand.contractAddress,
        amount: new BigNumber(demand.amount),
      }),
      timestamp,
    });
  }
}
