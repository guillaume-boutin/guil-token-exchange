import { Component } from "../../Component";
import { HandledOrder } from "../../../entities";
import styles from "./Trade.module.scss";

/**
 * @property {HandledOrder} props.trade
 * @property {string} props.account
 */
export class TradeRow extends Component {
  get time() {
    return this.props.trade.timestamp.format("h:mm:ss a M/D");
  }

  get amount() {
    return this.props.trade.order.token.unitaryAmount;
  }

  get tradeType() {
    if (this.props.trade.order.transactionType === "buy") {
      return this.props.trade.order.user === this.props.account
        ? "buy"
        : "sell";
    }

    return this.props.trade.order.user === this.props.account ? "sell" : "buy";
  }

  get price() {
    return this.props.trade.order.price.toFixed(5);
  }

  render() {
    return (
      <tr>
        <td>{this.time}</td>

        <td className={styles[this.tradeType]}>{this.amount}</td>

        <td>{this.price}</td>
      </tr>
    );
  }
}
