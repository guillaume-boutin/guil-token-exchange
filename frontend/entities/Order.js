import { Token } from "./Token";
import moment from "moment";

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

  get ether() {
    return this.offer.isEth ? this.offer : this.demand;
  }

  get token() {
    return this.offer.isEth ? this.demand : this.offer;
  }

  get price() {
    return this.ether.amount / this.token.amount;
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
        amount: offer.amount,
      }),
      demand: new Token({
        address: demand.contractAddress,
        amount: demand.amount,
      }),
      timestamp: moment.unix(timestamp),
    });
  }
}
