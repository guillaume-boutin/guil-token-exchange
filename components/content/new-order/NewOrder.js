import { Card, CardHeader, CardBody } from "../../common/card";
import { Tabs, Tab, TabList, TabPanel, TabPanels } from "../../common/tabs";
import style from "./NewOrder.module.scss";
import { connect } from "../../../context";
import { ETHER_ADDRESS } from "../../../helpers";
import BigNumber from "bignumber.js";
import { Component } from "../../Component";
import { OperationPanel } from "./OperationPanel";
import { Spinner } from "../../common/spinner";

class _NewOrder extends Component {
  boundMethods() {
    return [this.placeBuyOrder, this.placeSellOrder];
  }

  get isLoading() {
    return (
      this.props.exchange.tradesLoading ||
      this.props.exchange.ethBalanceLoading ||
      this.props.exchange.guilBalanceLoading
    );
  }

  get currentPrice() {
    const lastTrade =
      this.props.exchange.trades
        .sort((a, b) => (a.timestamp.isBefore(b.timestamp) ? -1 : 1))
        .slice(-1)[0] ?? null;

    return lastTrade ? lastTrade.order.price.toPrecision(4) : "0";
  }

  get noEthFunds() {
    return this.props.exchange.ethBalance <= 0;
  }

  get noGuilFunds() {
    return this.props.exchange.guilBalance <= 0;
  }

  placeBuyOrder(amount, price) {
    amount = new BigNumber(amount);
    price = new BigNumber(price);

    const offer = {
      contractAddress: ETHER_ADDRESS,
      amount: this.props.web3.web3.utils.toWei(
        amount.times(price).toString(),
        "ether"
      ),
    };

    const demand = {
      contractAddress: this.props.guilToken.contractAddress,
      amount: this.props.web3.web3.utils.toWei(amount.toString(), "ether"),
    };

    this.props.exchange.contract.methods
      .placeOrder(offer, demand)
      .send({ from: this.props.web3.account })
      .on("transactionHash", (hash) => {});
  }

  placeSellOrder(amount, price) {
    amount = new BigNumber(amount);
    price = new BigNumber(price);

    const offer = {
      contractAddress: this.props.guilToken.contractAddress,
      amount: this.props.web3.web3.utils.toWei(amount.toString(), "ether"),
    };

    const demand = {
      contractAddress: ETHER_ADDRESS,
      amount: this.props.web3.web3.utils.toWei(
        amount.times(price).toString(),
        "ether"
      ),
    };

    this.props.exchange.contract.methods
      .placeOrder(offer, demand)
      .send({ from: this.props.web3.account })
      .on("transactionHash", (hash) => {
      });
  }

  render() {
    return (
      <Card>
        <CardHeader>
          <h3>New Order</h3>
        </CardHeader>

        <CardBody className={style.carbBody}>
          {this.isLoading && <Spinner />}

          {!this.isLoading && (
            <Tabs className={style.tabs}>
              <TabList as="nav">
                <Tab as="a">Buy</Tab>

                <Tab as="a">Sell</Tab>
              </TabList>

              <TabPanels as="div">
                <TabPanel as="div" className={style.tabPanel}>
                  {this.noEthFunds && (
                    <div className={style.noFunds}>
                      You have no ETH funds. Deposit ETH in the Exchange, or
                      sell some GUIL from the Order Book.
                    </div>
                  )}

                  {!this.noEthFunds && (
                    <OperationPanel
                      operation="buy"
                      currentPrice={this.currentPrice}
                      maxPayingAmount={this.props.exchange.ethBalance}
                      onSubmit={this.placeBuyOrder}
                    />
                  )}
                </TabPanel>

                <TabPanel as="div" className={style.tabPanel}>
                  {this.noGuilFunds && (
                    <div className={style.noFunds}>
                      You have no GUIL funds. Deposit some GUIL in the Exchange,
                      or buy some from the Order Book. first.
                    </div>
                  )}

                  {!this.noGuilFunds && (
                    <OperationPanel
                      operation="sell"
                      currentPrice={this.currentPrice}
                      maxPayingAmount={this.props.exchange.guilBalance}
                      onSubmit={this.placeSellOrder}
                    />
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          )}
        </CardBody>
      </Card>
    );
  }
}

export const NewOrder = connect(
  ({ web3, exchange, guilToken }) => ({ web3, exchange, guilToken }),
  _NewOrder
);
