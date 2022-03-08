import { Token } from "./Token";
import moment from "moment";
import BigNumber from "bignumber.js";

/**
 * @property {string} id;
 * @property {string} user;
 * @property {Token} offer;
 * @property {Token} demand;
 * @property {moment.Moment} timestamp;
 */
export class Order {
  /**
   * @param props
   * @param props.id {string}
   * @param props.user {string}
   * @param props.offer {Token}
   * @param props.demand {Token}
   * @param props.timestamp {moment.Moment}
   */
  constructor({ id, user, offer, demand, timestamp }) {
    this.id = id;
    this.user = user;
    this.offer = offer;
    this.demand = demand;
    this.timestamp = timestamp;
  }

  /**
   * @return {"buy"|"sell"}
   */
  get transactionType() {
    return this.offer.isEth ? "buy" : "sell";
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
      timestamp: moment.unix(timestamp),
    });
  }
}
