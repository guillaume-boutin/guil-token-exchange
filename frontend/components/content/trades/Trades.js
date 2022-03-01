import { Component } from "../../Component";
import { Card, CardHeader, CardBody } from "../../common/card";
import { Table } from "../../common/table";
import { ContextConsumer, ExchangeConsumer } from "../../../context";
import { HandledOrder } from "../../../entities";
import { TradeRow } from "./TradeRow";

/**
 * @property {HandledOrder[]} props.trades
 * @property {string} props.account
 */
class TradesComponent extends Component {
  render() {
    console.log(this.props.account);

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

            <tbody>
              {this.props.trades.map((trade, i) => (
                <TradeRow key={i} trade={trade} account={this.props.account} />
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    );
  }
}

export const Trades = () => (
  <ContextConsumer>
    {({ web3, exchange }) => (
      <TradesComponent trades={exchange.filledOrders} account={web3.account} />
    )}
  </ContextConsumer>
);
