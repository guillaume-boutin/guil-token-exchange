import { Card, CardHeader, CardBody } from "../../common/card";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "../../common/tabs";
import { Table } from "../../common/table";
import { Component } from "../../Component";
import { connect } from "../../../context";
import { Order, HandledOrder } from "../../../entities";
import { TradeRow } from "./TradeRow";
import { OrderRow } from "./OrderRow";
import style from "./MyTransactions.module.scss";

/**
 * @property {string} props.account
 * @property {Order[]} props.orders
 * @property {HandledOrder[]} props.trades
 * @property {function(Order, string)} props.cancelOrder
 */
class MyTransactionsComponent extends Component {
  boundMethods() {
    return [this.onCancelOrder];
  }

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

  /**
   * @param {Order} order
   */
  onCancelOrder(order) {
    this.props.cancelOrder(order, this.props.account);
  }

  render() {
    return (
      <Card className={style.card}>
        <CardHeader>
          <h3>My Transactions</h3>
        </CardHeader>

        <CardBody className={style.cardBody}>
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
                    {this.trades.map((trade, i) => (
                      <TradeRow key={i} trade={trade} />
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
                    {this.orders.map((order, i) => (
                      <OrderRow
                        key={i}
                        order={order}
                        onCancel={this.onCancelOrder}
                      />
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

export const MyTransactions = connect(
  ({ web3, exchange }) => ({
    account: web3.account,
    orders: exchange.openOrders,
    trades: exchange.filledOrders,
    cancelOrder: exchange.cancelOrder,
  }),
  MyTransactionsComponent
);
