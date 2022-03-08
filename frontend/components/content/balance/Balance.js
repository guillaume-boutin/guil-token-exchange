import { Card, CardBody, CardHeader } from "../../common/card";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "../../common/tabs";
import { DepositPanel, WithdrawPanel } from ".";
import { connect } from "../../../context";
import { Component } from "../../Component";
import { ETHER_ADDRESS } from "../../../helpers";
import { Token } from "../../../entities";
import { Spinner } from "../../common/spinner";

import style from "./Balance.module.scss";
import BigNumber from "bignumber.js";

class _Balance extends Component {
  async componentDidMount() {
    await Promise.all([
      this.props.web3.loadEthBalance(),
      this.props.exchange.loadEthBalance(this.props.web3.account),
      this.props.guilToken.loadBalance(this.props.web3.account),
      this.props.exchange.loadGuilBalance(
        this.props.web3.account,
        this.props.guilToken.contractAddress
      ),
    ]);
  }

  get isLoading() {
    return (
      this.props.web3.ethBalance === null ||
      this.props.guilToken.balance === null ||
      this.props.exchange.ethBalance === null ||
      this.props.exchange.guilBalance === null
    );

    return (
      this.props.web3.ethBalanceLoading ||
      this.props.guilToken.balanceLoading ||
      this.props.exchange.balancesLoading
    );
  }

  get walletEthBalance() {
    return this.formatAmount(this.props.web3.ethBalance.shiftedBy(-18));
  }

  get exchangeEthBalance() {
    return this.formatAmount(this.props.exchange.ethBalance.shiftedBy(-18));
  }

  get walletGuilBalance() {
    return this.formatAmount(this.props.guilToken.balance.shiftedBy(-18));
  }

  get exchangeGuilBalance() {
    return this.formatAmount(this.props.exchange.guilBalance.shiftedBy(-18));
  }

  formatAmount(amount) {
    if (amount >= 10000) return amount.toFixed(0);

    return amount.precision(4).toString();
  }

  render() {
    return (
      <Card className={style.card}>
        <CardHeader className={style.cardHeader}>
          <h3>Balance</h3>
        </CardHeader>

        <CardBody className={style.cardBody}>
          {this.isLoading && <Spinner />}

          {!this.isLoading && (
            <Tabs>
              <TabList as="nav">
                <Tab as="a">Deposit</Tab>

                <Tab as="a">Withdraw</Tab>
              </TabList>
              <TabPanels as="div">
                <TabPanel>
                  <DepositPanel
                    walletEthBalance={this.walletEthBalance}
                    exchangeEthBalance={this.exchangeEthBalance}
                    walletGuilBalance={this.walletGuilBalance}
                    exchangeGuilBalance={this.exchangeGuilBalance}
                  />
                </TabPanel>

                <TabPanel>
                  <WithdrawPanel
                    walletEthBalance={this.walletEthBalance}
                    exchangeEthBalance={this.exchangeEthBalance}
                    walletGuilBalance={this.walletGuilBalance}
                    exchangeGuilBalance={this.exchangeGuilBalance}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          )}
        </CardBody>
      </Card>
    );
  }
}

export const Balance = connect(
  ({ web3, exchange, guilToken }) => ({
    web3,
    exchange,
    guilToken,
  }),
  _Balance
);
