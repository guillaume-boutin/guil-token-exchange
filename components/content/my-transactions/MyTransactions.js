import { Card, CardHeader, CardBody } from "../../common/card";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "../../common/tabs";
import { Table } from "../../common/table";
import { Context } from "../../../context";
import { Order } from "../../../entities";
import { TradeRow } from "./TradeRow";
import { OrderRow } from "./OrderRow";
import style from "./MyTransactions.module.scss";
import { Spinner } from "../../common/spinner";
import { useContext } from "react";
import { observer } from "mobx-react-lite";

const MyTransactionsComponent = () => {
  const { web3Store, ordersStore } = useContext(Context);

  const isLoading =
    !ordersStore.orders || !ordersStore.cancelledOrders || !ordersStore.trades;

  /** @type {Order[]} */
  const orders = [...(ordersStore.orders ?? [])]
    .filter((o) => o.user === web3Store.account)
    .sort((a, b) => (b.timestamp.isBefore(a.timestamp) ? -1 : 1));

  /** @type {Trade[]} */
  const trades = [...(ordersStore.trades ?? [])]
    .filter((t) => t.isActor(web3Store.account))
    .sort((a, b) => (b.timestamp.isBefore(a.timestamp) ? -1 : 1));

  /**
   * @param {Order} order
   */
  const _onCancelOrder = (order) => {
    web3Store.exchangeContract.methods
      .cancelOrder(order.id)
      .send({ from: web3Store.account })
      .on("transactionHash", (hash) => {})
      .on("error", (error) => {});
  };

  return (
    <Card className={style.card}>
      <CardHeader>
        <h3>My Transactions</h3>
      </CardHeader>

      <CardBody className={style.cardBody}>
        {isLoading && <Spinner />}

        {!isLoading && (
          <Tabs className={style.tabs}>
            <TabList as="nav">
              <Tab as="a">Trades</Tab>

              <Tab as="a">Orders</Tab>
            </TabList>

            <TabPanels as="div" className={style.tabPanels}>
              <TabPanel as="div" className={style.tabPanel}>
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
                      <TradeRow
                        key={i}
                        trade={trade}
                        account={web3Store.account}
                      />
                    ))}
                  </tbody>
                </Table>
              </TabPanel>

              <TabPanel as="div" className={style.tabPanel}>
                <Table>
                  <thead>
                    <tr>
                      <th>Amount</th>

                      <th>GUIL/ETH</th>

                      <th>Cancel</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.map((order, i) => (
                      <OrderRow
                        key={i}
                        order={order}
                        onCancel={_onCancelOrder}
                      />
                    ))}
                  </tbody>
                </Table>
              </TabPanel>
            </TabPanels>
          </Tabs>
        )}
      </CardBody>
    </Card>
  );
};

export const MyTransactions = observer(MyTransactionsComponent);
