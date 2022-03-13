import { Trade } from "../../../entities";
import { Component } from "../../Component";
import style from "./MyTransactions.module.scss";

/**
 * @property props
 * @property {Trade} props.trade
 * @property {string} props.account
 */
export class TradeRow extends Component {
  get time() {
    return this.props.trade.timestamp.format("h:mm:ss a M/D");
  }

  get amount() {
    const amount = this.props.trade.order.token.amount.shiftedBy(-18);
    return `${this.isEarning ? "+" : "-"}${amount}`;
  }

  get price() {
    const price = this.props.trade.order.price;

    if (price > 10000) return price.toFixed(0);

    return price.toPrecision(4);
  }

  get isEarning() {
    const trade = this.props.trade;
    const account = this.props.account;
    return trade.getEarning(account).is(trade.token);
  }

  render() {
    return (
      <tr>
        <td className={style.textMuted}>{this.time}</td>

        <td className={style[this.isEarning ? "earning" : "paying"]}>
          {this.amount}
        </td>

        <td>{this.price}</td>
      </tr>
    );
  }
}
