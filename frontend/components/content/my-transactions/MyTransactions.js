import { Card, CardHeader, CardBody } from "../../common/card";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "../../common/tabs";
import { Table } from "../../common/table";
import { Component } from "../../Component";
import { ContextConsumer } from "../../../context";
import { Order, HandledOrder } from "../../../entities";
import { TradeRow } from "./TradeRow";
import { OrderRow } from "./OrderRow";
import styles from "./MyTransactions.module.scss";

/**
 * @property {string} props.account
 * @property {Order[]} props.orders
 * @property {HandledOrder[]} props.trades
 */
class MyTransactionsComponent extends Component {
  get orders() {
    return this.props.orders
      .filter((o) => o.user === this.props.account)
      .sort((a, b) => (b.timestamp.isBefore(a.timestamp) ? -1 : 1));
  }

  get trades() {
    return this.props.trades
      .filter((t) => t.order.user === this.props.account)
      .sort((a, b) => (b.timestamp.isBefore(a.timestamp) ? -1 : 1));
  }

  render() {
    return (
      <Card className={styles.card}>
        <CardHeader>My Transactions</CardHeader>

        <CardBody className={styles.cardBody}>
          <Tabs className={styles.tabs}>
            <TabList as="nav">
              <Tab as="a">Trades</Tab>

              <Tab as="a">Orders</Tab>
            </TabList>

            <TabPanels as="div" className={styles.tabPanels}>
              <TabPanel as="div" className={styles.tabPanel}>
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
              </TabPanel>

              <TabPanel as="div" className={styles.tabPanel}>
                <Table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Amount</th>

                      <th>GUIL/ETH</th>

                      <th>Cancel</th>
                    </tr>
                  </thead>

                  <tbody className={styles.tbody}>
                    {this.orders.map((order, i) => (
                      <OrderRow key={i} order={order} />
                    ))}
                  </tbody>
                </Table>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>
    );
  }
}

export const MyTransactions = () => (
  <ContextConsumer>
    {({ web3, exchange }) => (
      <MyTransactionsComponent
        account={web3.account}
        orders={exchange.orders}
        trades={exchange.filledOrders}
      />
    )}
  </ContextConsumer>
);
