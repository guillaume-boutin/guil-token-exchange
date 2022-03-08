import { HandledOrder } from "../../../entities";
import { Component } from "../../Component";
import style from "./MyTransactions.module.scss";

/**
 * @property props
 * @property {HandledOrder} props.trade
 */
export class TradeRow extends Component {
  get time() {
    return this.props.trade.timestamp.format("h:mm:ss a M/D");
  }

  get amount() {
    const amount = this.props.trade.order.token.amount.shiftedBy(-18);
    return `${this.isBuy ? "+" : "-"}${amount}`;
  }

  get price() {
    const price = this.props.trade.order.price;

    if (price > 10000) return price.toFixed(0);

    return price.toPrecision(4);
  }

  get isBuy() {
    return this.props.trade.order.transactionType === "buy";
  }

  render() {
    return (
      <tr>
        <td className={style.textMuted}>{this.time}</td>

        <td className={style[this.isBuy ? "buy" : "sell"]}>{this.amount}</td>

        <td>{this.price}</td>
      </tr>
    );
  }
}
