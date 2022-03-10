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
   * @param {number} props.timestamp
   */
  constructor({ order, timestamp }) {
    this.order = order;
    this._timestamp = timestamp;
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

  /**
   * @return {moment.Moment}
   */
  get timestamp() {
    return moment.unix(this._timestamp);
  }
}

export class HandledOrderFactory {
  fromEventValues({ order, timestamp }) {
    return new HandledOrder({
      order: new OrderFactory().fromEventValues(order),
      timestamp,
    });
  }
}
