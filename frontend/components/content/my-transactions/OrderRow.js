import { Component } from "../../Component";
import { Order } from "../../../entities";
import styles from "./MyTransactions.module.scss";

/**
 * @property {Order} props.order
 */
export class OrderRow extends Component {
  boundMethods() {
    return [this.onCancelClick];
  }

  get time() {
    return this.props.order.timestamp.format("h:mm:ss a M/D");
  }

  get amount() {
    return this.props.order.token.unitaryAmount;
  }

  get price() {
    return this.props.order.price.toFixed(6);
  }

  get isBuy() {
    return this.props.order.transactionType === "buy";
  }

  onCancelClick(e) {}

  render() {
    return (
      <tr>
        <td>{this.time}</td>

        <td className={styles[this.isBuy ? "buy" : "sell"]}>
          {this.isBuy ? "+" : "-"} {this.amount}
        </td>

        <td>
          <span className={styles.cancelBtn} onClick={this.onCancelClick}>
            &times;
          </span>
        </td>
      </tr>
    );
  }
}
