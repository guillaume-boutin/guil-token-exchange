import { Component } from "../../Component";
import { Card, CardHeader, CardBody } from "../../common/card";
import { Table } from "../../common/table";
import { ContextConsumer, ExchangeConsumer } from "../../../context";
import { HandledOrder } from "../../../entities";
import { TradeRow } from "./TradeRow";
import styles from "./Trade.module.scss";

/**
 * @property {HandledOrder[]} props.trades
 */
class TradesComponent extends Component {
  get trades() {
    return this.props.trades.sort((a, b) =>
      b.timestamp.isBefore(a.timestamp) ? -1 : 1
    );
  }

  render() {
    return (
      <Card className={styles.card}>
        <CardHeader>Trades</CardHeader>

        <CardBody className={styles.cardBody}>
          <Table>
            <thead>
              <tr>
                <th>Time</th>

                <th>GUIL</th>

                <th>GUIL/ETH</th>
              </tr>
            </thead>

            <tbody>
              {this.trades.map((trade, i) => (
                <TradeRow key={i} trade={trade} />
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
    {({ exchange }) => <TradesComponent trades={exchange.filledOrders} />}
  </ContextConsumer>
);
