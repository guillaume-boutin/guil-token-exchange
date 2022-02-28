import { Component } from "../../Component";
import { Card, CardHeader, CardBody } from "../../common/card";
import { Table } from "../../common/table";

/**
 * @property {{ time: moment.Moment, tokenAmount: Number, price: Number }[]} props.trades
 */
export class Trades extends Component {
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
