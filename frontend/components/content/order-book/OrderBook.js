import React, { Component } from "react";
import { Card, CardHeader, CardBody } from "../../common/card";
import { OrderTable } from ".";

export class OrderBook extends Component {
  get buyOrders() {
    return [{ tokenAmount: 10, price: 0.00025, ethAmount: 0.01, type: "buy" }];
  }

  get sellOrders() {
    return [{ tokenAmount: 10, price: 0.00025, ethAmount: 0.01, type: "sell" }];
  }

  render() {
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
