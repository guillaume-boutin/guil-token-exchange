import { Card, CardBody, CardHeader } from "../../common/card";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "../../common/tabs";
import { DepositPanel, WithdrawPanel } from ".";
import { connect } from "../../../context";
import { Component } from "../../Component";
import { ETHER_ADDRESS } from "../../../helpers";
import { Token } from "../../../entities";
import { Spinner } from "../../common/spinner";

import style from "./Balance.module.scss";

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
      this.props.web3.ethBalanceLoading ||
      this.props.guilToken.balanceLoading ||
      this.props.exchange.ethBalanceLoading ||
      this.props.exchange.guilBalanceLoading
    );
  }

  get walletEthBalance() {
    return new Token({
      address: ETHER_ADDRESS,
      amount: this.props.web3.ethBalance,
    });
  }

  get exchangeEthBalance() {
    return new Token({
      address: ETHER_ADDRESS,
      amount: this.props.exchange.ethBalance,
    });
  }

  get walletGuilBalance() {
    return new Token({
      address: this.props.guiltTokenAddress,
      amount: this.props.guilToken.balance,
    });
  }

  get exchangeGuilBalance() {
    return new Token({
      address: this.props.guiltTokenAddress,
      amount: this.props.exchange.guilBalance,
    });
  }

  render() {
    return (
      <Card className={style.card}>
        <CardHeader className={style.cardHeader}>Balance</CardHeader>

        <CardBody className={style.cardBody}>
          {this.isLoading && (
            <div className={style.spinnerContainer}>
              <Spinner />
            </div>
          )}

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
