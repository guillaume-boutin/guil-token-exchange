import { Card, CardHeader, CardBody } from "../../common/card";
import { OrderTable } from ".";
import styles from "./OrderBook.module.scss";
import { Spinner } from "../../common/spinner";
import { useContext } from "react";
import { Context } from "../../../context";
import { observer } from "mobx-react-lite";

const _OrderBook = () => {
  const { ordersStore } = useContext(Context);

  const isLoading =
    ordersStore.orders === null ||
    ordersStore.cancelledOrders === null ||
    ordersStore.trades === null;

  const buyOrders = () => {
    return ordersStore.openOrders
      .filter((openOrder) => openOrder.transactionType === "buy")
      .sort((a, b) => a.price - b.price);
  };

  const sellOrders = () => {
    return ordersStore.openOrders
      .filter((openOrder) => openOrder.transactionType === "sell")
      .sort((a, b) => b.price - a.price);
  };

  return (
    <Card className={styles.card}>
      <CardHeader className={styles.cardHeader}>
        <h3>Order Book</h3>
      </CardHeader>

      <CardBody className={styles.cardBody}>
        {isLoading && <Spinner />}

        {!isLoading && (
          <>
            <div className={styles.tableContainer}>
              <OrderTable orders={buyOrders()} />
            </div>

            <div className={styles.tableContainer}>
              <OrderTable orders={sellOrders()} />
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
};

export const OrderBook = observer(_OrderBook);
