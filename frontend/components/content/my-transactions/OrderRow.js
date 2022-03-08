import { Component } from "../../Component";
import { Order } from "../../../entities";
import style from "./MyTransactions.module.scss";

/**
 * @property {Order} props.order
 * @property {function(Order)} props.onCancel
 */
export class OrderRow extends Component {
  boundMethods() {
    return [this.onCancelClick];
  }

  get time() {
    return this.props.order.timestamp.format("h:mm:ss a M/D");
  }

  get amount() {
    return this.props.order.token.unitaryAmount.toString();
  }

  get price() {
    return this.props.order.price.toFixed(6);
  }

  get isBuy() {
    return this.props.order.transactionType === "buy";
  }

  onCancelClick(e) {
    this.props.onCancel(this.props.order);
  }

  render() {
    return (
      <tr>
        <td className={style[this.isBuy ? "buy" : "sell"]}>
          {this.isBuy ? "+" : "-"} {this.amount}
        </td>

        <td>{this.price}</td>

        <td>
          <span className={style.cancelBtn} onClick={this.onCancelClick}>
            &times;
          </span>
        </td>
      </tr>
    );
  }
}
