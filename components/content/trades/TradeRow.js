import { Component } from "../../Component";
import { Trade } from "../../../entities";
import style from "./Trade.module.scss";

/**
 * @property {Trade} props.trade
 */
export class TradeRow extends Component {
  get time() {
    return this.props.trade.timestamp.format("h:mm:ss a M/D");
  }

  get amount() {
    return this.props.trade.order.token.amount.shiftedBy(-18).toString();
  }

  get isBuy() {
    return this.props.trade.order.isBuy;
  }

  get price() {
    const price = this.props.trade.order.price;

    return price > 10000 ? price.toFixed(0) : price.toPrecision(4);
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
