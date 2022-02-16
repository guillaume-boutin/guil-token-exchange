import { Card } from "../../common/card/Card";
import { CardHeader } from "../../common/card/CardHeader";
import { CardBody } from "../../common/card/CardBody";
import { Table } from "../../common/table/table";
import React, { Component } from "react";

/**
 * @property {{ time: moment.Moment, tokenAmount: Number, price: Number }[]} props.trades
 */
export class Trade extends Component {
  render() {
    return (
      <Card>
        <CardHeader>Trades</CardHeader>

        <CardBody>
          <Table>
            <thead>
              <tr>
                <th>Time</th>

                <th>GUIL</th>

                <th>GUIL/ETH</th>
              </tr>
            </thead>
          </Table>
        </CardBody>
      </Card>
    );
  }
}
