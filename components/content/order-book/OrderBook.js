import React, { Component } from "react";
import { Card, CardHeader, CardBody } from "../../common/card";
import { OrderTable } from ".";
import { connect } from "../../../context";
import styles from "./OrderBook.module.scss";
import { Spinner } from "../../common/spinner";

/**
 * @property {Order[]} props.openOrders
 */
class _OrderBook extends Component {
  constructor(props) {
    super(props);
  }

  get isLoading() {
    return this.props.exchange.anyOrdersLoading;
  }

  get buyOrders() {
    return this.props.exchange.openOrders
      .filter((openOrder) => openOrder.transactionType === "buy")
      .sort((a, b) => a.price - b.price);
  }

  get sellOrders() {
    return this.props.exchange.openOrders
      .filter((openOrder) => openOrder.transactionType === "sell")
      .sort((a, b) => b.price - a.price);
  }

  render() {
    return (
      <Card className={styles.card}>
        <CardHeader className={styles.cardHeader}>
          <h3>Order Book</h3>
        </CardHeader>

        <CardBody className={styles.cardBody}>
          {this.isLoading && <Spinner />}

          {!this.isLoading && (
            <>
              <div className={styles.tableContainer}>
                <OrderTable orders={this.buyOrders} />
              </div>

              <div className={styles.tableContainer}>
                <OrderTable orders={this.sellOrders} />
              </div>
            </>
          )}
        </CardBody>
      </Card>
    );
  }
}

export const OrderBook = connect(
  ({ exchange }) => ({
    exchange,
  }),
  _OrderBook
);