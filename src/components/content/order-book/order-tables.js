import React, { Component } from "react";
import { Table } from "../../common/table/table";
import { Order } from "./Order";

/**
 * @property {Order[]} props.buyOrders
 * @property {Order[]} props.sellOrders
 */
export class OrderTables extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    this.props.buyOrders = {};
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
          <tr>
            <td>10</td>

            <td>0.00100</td>

            <td>0.01</td>
          </tr>
        </tbody>

        <thead>
          <tr>
            <th>GUIL</th>

            <th>GUIL/ETH</th>

            <th>ETH</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>10</td>

            <td>0.00100</td>

            <td>0.01</td>
          </tr>
        </tbody>
      </Table>
    );
  }
}
