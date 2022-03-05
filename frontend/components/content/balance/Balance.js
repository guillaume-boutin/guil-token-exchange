import { Card, CardBody, CardHeader } from "../../common/card";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "../../common/tabs";
import { DepositPanel, WithdrawPanel } from ".";
import { connect } from "../../../context";
import { Component } from "../../Component";
import { Web3Service } from "../../../services";
import { ETHER_ADDRESS } from "../../../helpers";
import { Token } from "../../../entities";
import { Spinner } from "../../common/spinner";

import style from "./Balance.module.scss";

class _Balance extends Component {
  constructor(props) {
    super(props);

    this.web3Service = new Web3Service();
  }

  async componentDidMount() {
    await Promise.all([
      this.loadWalletEthBalance(),
      this.loadExchangeEthBalance(),
      this.loadWalletGuilBalance(),
      this.loadExchangeGuilBalance(),
    ]);
  }

  async loadWalletEthBalance() {
    this.props.setWalletEthBalanceLoading(true);
    const balance = await this.props.web3.eth.getBalance(this.props.account);
    this.props.setWalletEthBalance(balance);
    this.props.setWalletEthBalanceLoading(false);
  }

  async loadExchangeEthBalance() {
    this.props.setExchangeEthBalanceLoading(true);
    const balance = await this.props.exchangeContract.methods
      .balanceOf(this.props.account, ETHER_ADDRESS)
      .call();
    this.props.setExchangeEthBalance(balance);
    this.props.setExchangeEthBalanceLoading(false);
  }

  async loadWalletGuilBalance() {
    this.props.setWalletGuilBalanceLoading(true);
    const balance = await this.props.guilTokenContract.methods
      .balanceOf(this.props.account)
      .call();
    this.props.setWalletGuilBalance(balance);
    this.props.setWalletGuilBalanceLoading(false);
  }

  async loadExchangeGuilBalance() {
    this.props.setExchangeGuilBalanceLoading(true);
    const balance = await this.props.exchangeContract.methods
      .balanceOf(this.props.account, this.props.guilTokenAddress)
      .call();
    this.props.setExchangeGuilBalance(balance);
    this.props.setExchangeGuilBalanceLoading(false);
  }

  get isLoading() {
    return (
      this.props.walletEthBalanceLoading ||
      this.props.walletGuilBalanceLoading ||
      this.props.exchangeEthBalanceLoading ||
      this.props.exchangeGuilBalanceLoading
    );
  }

  get walletEthBalance() {
    return new Token({
      address: ETHER_ADDRESS,
      amount: this.props.walletEthBalance,
    });
  }

  get exchangeEthBalance() {
    return new Token({
      address: ETHER_ADDRESS,
      amount: this.props.exchangeEthBalance,
    });
  }

  get walletGuilBalance() {
    return new Token({
      address: this.props.guiltTokenAddress,
      amount: this.props.walletGuilBalance,
    });
  }

  get exchangeGuilBalance() {
    return new Token({
      address: this.props.guiltTokenAddress,
      amount: this.props.exchangeGuilBalance,
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
                    account={this.props.account}
                    exchangeContract={this.props.exchangeContract}
                    setExchangeEthBalanceLoading={
                      this.props.setExchangeEthBalanceLoading
                    }
                    setWalletGuilBalanceLoading={
                      this.props.setWalletGuilBalanceLoading
                    }
                    guilTokenContract={this.props.guilTokenContract}
                    walletEthBalance={this.walletEthBalance}
                    exchangeEthBalance={this.exchangeEthBalance}
                    walletGuilBalance={this.walletGuilBalance}
                    exchangeGuilBalance={this.exchangeGuilBalance}
                  />
                </TabPanel>

                <TabPanel>
                  <WithdrawPanel
                    account={this.props.account}
                    exchangeContract={this.props.exchangeContract}
                    setExchangeEthBalanceLoading={
                      this.props.setExchangeEthBalanceLoading
                    }
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
    web3: web3.web3,
    account: web3.account,
    walletEthBalance: web3.ethBalance,
    setWalletEthBalance: web3.setEthBalance,
    walletEthBalanceLoading: web3.ethBalanceLoading,
    setWalletEthBalanceLoading: web3.setEthBalanceLoading,
    exchangeContract: exchange.contract,
    exchangeEthBalance: exchange.ethBalance,
    setExchangeEthBalance: exchange.setEthBalance,
    exchangeEthBalanceLoading: exchange.ethBalanceLoading,
    setExchangeEthBalanceLoading: exchange.setEthBalanceLoading,
    exchangeGuilBalance: exchange.guilBalance,
    setExchangeGuilBalance: exchange.setGuilBalance,
    exchangeGuilBalanceLoading: exchange.guilBalanceLoading,
    setExchangeGuilBalanceLoading: exchange.setGuilBalanceLoading,
    guilTokenContract: guilToken.contract,
    guilTokenAddress: guilToken.contractAddress,
    walletGuilBalance: guilToken.balance,
    setWalletGuilBalance: guilToken.setBalance,
    walletGuilBalanceLoading: guilToken.balanceLoading,
    setWalletGuilBalanceLoading: guilToken.setBalanceLoading,
  }),
  _Balance
);
