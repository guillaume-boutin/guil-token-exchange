import { Order, OrderFactory } from "./Order";
import moment from "moment";
import { HandledOrder } from "./HandledOrder";

export class FilledOrder extends HandledOrder {
  constructor(props) {
    super(props);
    this.user = props.user;
  }
}

export class FilledOrderFactory {
  fromEventValues({ order, user, timestamp }) {
    return new FilledOrder({
      order: new OrderFactory().fromEventValues(order),
      user,
      timestamp: moment.unix(timestamp),
    });
  }
}
