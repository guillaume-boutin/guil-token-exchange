import { NavBar } from "../nav-bar";
import { Content } from "../content";
import styles from "./App.module.scss";
import { connect } from "../../context";
import { Component } from "../Component";
import { Web3Service } from "../../services";
import {
  HandledOrderFactory,
  OrderFactory,
  TokenFactory,
} from "../../entities";
import { Token } from "../../entities";
import { TradeFactory } from "../../entities/Trade";

class AppComponent extends Component {
  /** @private {Web3Service} */ web3Service;

  constructor(props) {
    super(props);

    this.web3Service = new Web3Service();
  }

  boundMethods() {
    return [
      this.onDepositEvent,
      this.onWithdrawEvent,
      this.onOrderEvent,
      this.onTradeEvent,
      this.onCancelEvent,
      this.refreshExchangeBalances,
      this.addToExchangeBalance,
      this.subtractFromExchangeBalance,
    ];
  }

  async componentDidMount() {
    const web3 = await this.web3Service.getWeb3();
    if (!web3) return;

    this.props.web3.setWeb3(web3);
    this.props.web3.setWeb3Loaded(true);

    await Promise.all([
      this.loadAccount(web3),
      this.loadExchangeContract(web3),
      this.loadGuilTokenContract(web3),
    ]);
  }

  async loadAccount(web3) {
    const account = await this.web3Service.getAccount(web3);
    this.props.web3.setAccount(account);
  }

  async loadExchangeContract(web3) {
    if (this.props.exchange.contract) return;

    const contract = await this.web3Service.getExchangeContract(web3);

    contract.events.Deposit({}, this.onDepositEvent);
    contract.events.Withdraw({}, this.onWithdrawEvent);
    contract.events.Order({}, this.onOrderEvent);
    contract.events.Cancel({}, this.onCancelEvent);
    contract.events.Trade({}, this.onTradeEvent);

    this.props.exchange.setContract(contract);
  }

  async loadGuilTokenContract(web3) {
    if (this.props.guilToken.contract) return;

    const contract = await this.web3Service.getGuilTokenContract(web3);
    this.props.guilToken.setContract(contract);
  }

  async onDepositEvent(error, event) {
    const account = this.props.web3.account;
    if (account !== event.returnValues.user) return;

    const token = new TokenFactory().fromExchangeTransferEvent(
      event.returnValues
    );

    this.subtractFromWalletBalance(token);
    this.addToExchangeBalance(token);

    if (!token.isEth) return;

    await this.props.web3.loadEthBalance();
    this.props.exchange.setBalancesLoading(false);
  }

  async onWithdrawEvent(error, event) {
    const account = this.props.web3.account;
    if (account !== event.returnValues.user) return;

    const token = new TokenFactory().fromExchangeTransferEvent(
      event.returnValues
    );

    this.addToWalletBalance(token);
    this.subtractFromExchangeBalance(token);

    if (!token.isEth) return;

    await this.props.web3.loadEthBalance();
    this.props.exchange.setBalancesLoading(false);
  }

  onOrderEvent(error, event) {
    const order = new OrderFactory().fromEventValues(event.returnValues);

    this.props.exchange.addToOrders(order);

    const account = this.props.web3.account;
    if (account !== order.user) return;

    this.subtractFromExchangeBalance(order.offer);
  }

  onCancelEvent(error, event) {
    const cancelledOrder = new HandledOrderFactory().fromEventValues(
      event.returnValues
    );
    this.props.exchange.addToCancelledOrders(cancelledOrder);

    const account = this.props.web3.account;

    if (account !== cancelledOrder.order.user) return;

    this.addToExchangeBalance(cancelledOrder.order.offer);

    this.props.exchange.setOrderCancelling(false);
  }

  onTradeEvent(error, event) {
    const trade = new TradeFactory().fromEventValues(event.returnValues);
    this.props.exchange.addToTrades(trade);

    const account = this.props.web3.account;

    if (!trade.isActor(account)) return;

    this.refreshExchangeBalances(trade);

    if (!trade.isTaker(account)) return;

    this.props.exchange.setOrderFilling(false);
  }

  /**
   * @param {Trade} trade
   */
  refreshExchangeBalances(trade) {
    const account = this.props.web3.account;
    const feeRate = this.props.exchange.feeRate;

    const earning = trade.getEarning(account);
    const fee = trade.getFee(account, feeRate);

    console.log(earning, fee);

    const paying = trade.getPaying(account);

    this.addToExchangeBalance(earning.minus(fee));
    this.subtractFromExchangeBalance(paying);
  }

  /**
   * @param {Token} token
   */
  addToWalletBalance(token) {
    if (token.isEth) return;

    this.props.guilToken.addToBalance(token.amount);
  }

  /**
   * @param {Token} token
   */
  subtractFromWalletBalance(token) {
    if (token.isEth) return;

    this.props.guilToken.addToBalance(token.amount.negated());
  }

  /**
   * @param {Token} token
   */
  addToExchangeBalance(token) {
    if (token.isEth) return this.props.exchange.addToEthBalance(token.amount);

    this.props.exchange.addToGuilBalance(token.amount);
  }

  /**
   * @param {Token} token
   */
  subtractFromExchangeBalance(token) {
    if (token.isEth)
      return this.props.exchange.addToEthBalance(token.amount.negated());

    this.props.exchange.addToGuilBalance(token.amount.negated());
  }

  render() {
    return (
      <div className={styles.app}>
        <NavBar />

        <Content />
      </div>
    );
  }
}

export const App = connect(
  ({ web3, exchange, guilToken }) => ({
    web3,
    exchange,
    guilToken,
  }),
  AppComponent
);
