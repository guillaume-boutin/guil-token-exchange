import { Order } from "../../../entities";
import style from "./MyTransactions.module.scss";
import React, { Component } from "react";

/**
 * @property {Order} props.order
 * @property {function(Order)} props.onCancel
 */
export class OrderRow extends Component {
  constructor(props) {
    super(props);

    this.onCancelClick = this.onCancelClick.bind(this);
  }

  get time() {
    return this.props.order.timestamp.format("h:mm:ss a M/D");
  }

  get displayAmount() {
    const amount = this.props.order.token.amount.shiftedBy(-18).toString();
    return `${this.isEarning ? "+" : "-"}${amount}`;
  }

  get price() {
    const price = this.props.order.price;

    if (price > 10000) return price.toFixed(0);

    return price.toPrecision(4);
  }

  get isEarning() {
    const order = this.props.order;
    return order.token.is(order.offer);
  }

  onCancelClick(e) {
    this.props.onCancel(this.props.order);
  }

  render() {
    return (
      <tr>
        <td className={style[this.isEarning ? "earning" : "paying"]}>
          {this.displayAmount}
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
