import { Component } from "../../Component";
import { HandledOrder } from "../../../entities";
import style from "./Trade.module.scss";

/**
 * @property {HandledOrder} props.trade
 */
export class TradeRow extends Component {
  get time() {
    return this.props.trade.timestamp.format("h:mm:ss a M/D");
  }

  get amount() {
    return this.props.trade.order.token.unitaryAmount;
  }

  get tradeType() {
    return this.props.trade.order.transactionType;
  }

  get price() {
    return this.props.trade.order.price.toFixed(5);
  }

  render() {
    return (
      <tr>
        <td className={style.textMuted}>{this.time}</td>

        <td className={style[this.tradeType]}>{this.amount}</td>

        <td>{this.price}</td>
      </tr>
    );
  }
}
