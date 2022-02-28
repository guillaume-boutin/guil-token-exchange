import { Order, OrderFactory } from "./Order";
import moment from "moment";

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
}

export class HandledOrderFactory {
  fromEventValues({ order, timestamp }) {
    return new HandledOrder({
      order: new OrderFactory().fromEventValues(order),
      timestamp: moment.unix(timestamp),
    });
  }
}
