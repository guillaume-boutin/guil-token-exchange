import React, { Component } from "react";
import { Card, CardHeader, CardBody } from "../../common/card";
import { OrderTable } from ".";
import { Web3Consumer, ExchangeConsumer } from "../../../context";

class OrderBookComponent extends Component {
  constructor(props) {
    super(props);
  }

  get buyOrders() {
    return [{ tokenAmount: 10, price: 0.00025, ethAmount: 0.01, type: "buy" }];
  }

  get sellOrders() {
    return [{ tokenAmount: 10, price: 0.00025, ethAmount: 0.01, type: "sell" }];
  }

  render() {
    console.log(this.props.openOrders);
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
