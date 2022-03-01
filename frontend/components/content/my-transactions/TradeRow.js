import { HandledOrder } from "../../../entities";
import { Component } from "../../Component";
import styles from "./MyTransactions.module.scss";

/**
 * @property props
 * @property {HandledOrder} props.trade
 */
export class TradeRow extends Component {
  get time() {
    return this.props.trade.timestamp.format("h:mm:ss a M/D");
  }

  get amount() {
    return this.props.trade.order.token.unitaryAmount;
  }

  get price() {
    return this.props.trade.order.price.toFixed(6);
  }

  get isBuy() {
    return this.props.trade.order.transactionType === "buy";
  }

  render() {
    return (
      <tr>
        <td>{this.time}</td>

        <td className={styles[this.isBuy ? "buy" : "sell"]}>
          {this.isBuy ? "+" : "-"} {this.amount}
        </td>

        <td>{this.price}</td>
      </tr>
    );
  }
}
