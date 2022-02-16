import React, { Component } from "react";
import { Card } from "../../common/card/Card";
import { CardHeader } from "../../common/card/CardHeader";
import { CardBody } from "../../common/card/CardBody";
import OrderTable from "./order-table";

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
