import { Card, CardHeader, CardBody } from "../../common/card";
import { Table } from "../../common/table";
import { Context } from "../../../context";
import { TradeRow } from "./TradeRow";
import styles from "./Trade.module.scss";
import { Spinner } from "../../common/spinner";
import { useContext } from "react";
import { observer } from "mobx-react-lite";

const TradesComponent = () => {
  const { ordersStore } = useContext(Context);

  const isLoading = ordersStore.trades === null;

  const trades = [...(ordersStore.trades ?? [])].sort((a, b) =>
    b.timestamp.isBefore(a.timestamp) ? -1 : 1
  );

  return (
    <Card className={styles.card}>
      <CardHeader>
        <h3>Trades</h3>
      </CardHeader>

      <CardBody className={styles.cardBody}>
        {isLoading && <Spinner />}

        {!isLoading && (
          <Table>
            <thead>
              <tr>
                <th>Time</th>

                <th>GUIL</th>

                <th>GUIL/ETH</th>
              </tr>
            </thead>

            <tbody>
              {trades.map((trade, i) => (
                <TradeRow key={i} trade={trade} />
              ))}
            </tbody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
};

export const Trades = observer(TradesComponent);
