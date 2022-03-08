import { Order, OrderFactory } from "./Order";
import moment from "moment";
import { Token } from "./Token";

/**
 * @property {Order} order;
 * @property {moment.Moment} timestamp;
 */
export class HandledOrder {
  /**
   * @param props
   * @param {Order} props.order
   * @param {moment.Moment} props.timestamp
   */
  constructor({ order, timestamp }) {
    this.order = order;
    this.timestamp = timestamp;
  }

  /**
   * @return {boolean}
   */
  get isBuy() {
    return this.order.isBuy;
  }

  /**
   * @return {boolean}
   */
  get isSell() {
    return this.order.isSell;
  }

  /**
   * @return {Token}
   */
  get offer() {
    return this.order.offer;
  }

  /**
   * @return {Token}
   */
  get demand() {
    return this.order.demand;
  }
}

export class HandledOrderFactory {
  fromEventValues({ order, timestamp }) {
    return new HandledOrder({
      order: new OrderFactory().fromEventValues(order),
      timestamp: moment.unix(timestamp),
    });
  }
}
