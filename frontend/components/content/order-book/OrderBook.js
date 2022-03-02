import React, { Component } from "react";
import { Card, CardHeader, CardBody } from "../../common/card";
import { OrderTable } from ".";
import { connect, ExchangeConsumer } from "../../../context";
import styles from "./OrderBook.module.scss";

/**
 * @property {Order[]} props.openOrders
 */
class OrderBookComponent extends Component {
  constructor(props) {
    super(props);
  }

  get buyOrders() {
    return this.props.openOrders.filter(
      (openOrder) => openOrder.transactionType === "buy"
    );
  }

  get sellOrders() {
    return this.props.openOrders.filter(
      (openOrder) => openOrder.transactionType === "sell"
    );
  }

  render() {
    // console.log(this.props.orders);
    return (
      <Card className={styles.card}>
        <CardHeader className={styles.cardHeader}>Order Book</CardHeader>

        <CardBody className={styles.cardBody}>
          <div className={styles.tableContainer}>
            <OrderTable orders={this.buyOrders} />
          </div>

          <div className={styles.tableContainer}>
            <OrderTable orders={this.sellOrders} />
          </div>
        </CardBody>
      </Card>
    );
  }
}

export const OrderBook = connect(
  ({ exchange }) => ({
    orders: exchange.orders,
    openOrders: exchange.openOrders,
  }),
  OrderBookComponent
);
