import React, { Component } from "react";
import { Table } from "../../common/table/table";
import styles from "./styles.module.scss";

/**
 * @typedef {{ tokenAmount: Number, ethAmount: Number, price: Number, type: "buy"|"sell" }} Order
 */

/**
 * @param props
 * @param {Order} props.order
 */
const Row = ({ order }) => (
  <tr>
    <td>{order.tokenAmount}</td>

    <td className={styles[order.type]}>{order.price}</td>

    <td>{order.ethAmount}</td>
  </tr>
);

/**
 * @property {Order[]} props.orders
 */
export default class OrderTable extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Table>
        <thead>
          <tr>
            <th>GUIL</th>

            <th>GUIL/ETH</th>

            <th>ETH</th>
          </tr>
        </thead>

        <tbody>
          {this.props.orders.map((order, i) => (
            <Row key={i} order={order} />
          ))}
        </tbody>
      </Table>
    );
  }
}
