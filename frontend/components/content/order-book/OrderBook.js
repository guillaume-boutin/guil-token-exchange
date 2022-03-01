import React, { Component } from "react";
import { Card, CardHeader, CardBody } from "../../common/card";
import { OrderTable } from ".";
import { ExchangeConsumer } from "../../../context";

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
      <Card>
        <CardHeader>Order Book</CardHeader>

        <CardBody>
          <OrderTable orders={this.buyOrders} />

          <OrderTable orders={this.sellOrders} />
        </CardBody>
      </Card>
    );
  }
}

export const OrderBook = () => (
  <ExchangeConsumer>
    {({ orders, openOrders }) => {
      return <OrderBookComponent orders={orders} openOrders={openOrders} />;
    }}
  </ExchangeConsumer>
);
