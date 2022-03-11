import { Component } from "../../Component";
import { Card, CardHeader, CardBody } from "../../common/card";
import { Table } from "../../common/table";
import { connect } from "../../../context";
import { TradeRow } from "./TradeRow";
import styles from "./Trade.module.scss";
import { Spinner } from "../../common/spinner";

class TradesComponent extends Component {
  get trades() {
    return this.props.exchange.trades.sort((a, b) =>
      b.timestamp.isBefore(a.timestamp) ? -1 : 1
    );
  }

  get isLoading() {
    return this.props.exchange.tradesLoading;
  }

  render() {
    return (
      <Card className={styles.card}>
        <CardHeader>
          <h3>Trades</h3>
        </CardHeader>

        <CardBody className={styles.cardBody}>
          {this.isLoading && <Spinner />}

          {!this.isLoading && (
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
          )}
        </CardBody>
      </Card>
    );
  }
}

export const Trades = connect(
  ({ exchange }) => ({ exchange }),
  TradesComponent
);
