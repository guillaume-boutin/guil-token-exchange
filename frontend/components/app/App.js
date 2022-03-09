import { NavBar } from "../nav-bar";
import { Content } from "../content";
import styles from "./App.module.scss";
import { connect } from "../../context";
import { Component } from "../Component";
import { Web3Service } from "../../services";
import { HandledOrderFactory, OrderFactory } from "../../entities";
import { ETHER_ADDRESS } from "../../helpers";
import { FilledOrder, FilledOrderFactory } from "../../entities/FilledOrder";
import BigNumber from "bignumber.js";

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
      this.refreshTradeTakerBalances,
      this.refreshTradePlacerBalances,
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
    const contract = await this.web3Service.getExchangeContract(web3);

    contract.events.Deposit({}, this.onDepositEvent);
    contract.events.Withdraw({}, this.onWithdrawEvent);
    contract.events.Order({}, this.onOrderEvent);
    contract.events.Cancel({}, this.onCancelEvent);
    contract.events.Trade({}, this.onTradeEvent);

    this.props.exchange.setContract(contract);
  }

  async onDepositEvent(error, event) {
    const account = this.props.web3.account;
    if (account !== event.returnValues.user) return;

    const tokenAddress = event.returnValues.token.contractAddress;
    const amount = new BigNumber(event.returnValues.token.amount);

    if (tokenAddress === ETHER_ADDRESS) {
      this.props.exchange.addToEthBalance(amount);
      await this.props.web3.loadEthBalance();
    } else {
      this.props.guilToken.addToBalance(amount.negated());
      this.props.exchange.addToGuilBalance(amount);
    }

    this.props.exchange.setBalancesLoading(false);
  }

  async onWithdrawEvent(error, event) {
    const account = this.props.web3.account;
    if (account !== event.returnValues.user) return;

    const tokenAddress = event.returnValues.token.contractAddress;
    const amount = new BigNumber(event.returnValues.token.amount);

    if (tokenAddress === ETHER_ADDRESS) {
      this.props.exchange.addToEthBalance(amount.negated());
      await this.props.web3.loadEthBalance();
    } else {
      this.props.exchange.addToGuilBalance(amount.negated());
      this.props.guilToken.addToBalance(amount);
    }

    this.props.exchange.setBalancesLoading(false);
  }

  onOrderEvent(error, event) {
    const order = new OrderFactory().fromEventValues(event.returnValues);

    this.props.exchange.addToOrders(order);

    const account = this.props.web3.account;
    if (account !== order.user) return;

    if (order.offer.isEth) {
      this.props.exchange.addToEthBalance(order.offer.amount.negated());
    } else {
      this.props.exchange.addToGuilBalance(order.offer.amount.negated());
    }
  }

  onCancelEvent(error, event) {
    const cancelledOrder = new HandledOrderFactory().fromEventValues(
      event.returnValues
    );
    this.props.exchange.addToCancelledOrders(cancelledOrder);

    const account = this.props.web3.account;

    if (account !== cancelledOrder.order.user) return;

    if (cancelledOrder.order.offer.isEth) {
      this.props.exchange.addToEthBalance(cancelledOrder.order.offer.amount);
    } else {
      this.props.exchange.addToGuilBalance(cancelledOrder.order.offer.amount);
    }

    this.props.exchange.setOrderCancelling(false);
  }

  onTradeEvent(error, event) {
    const trade = new FilledOrderFactory().fromEventValues(event.returnValues);
    this.props.exchange.addToFilledOrders(trade);

    const account = this.props.web3.account;
    const placer = trade.order.user;
    const taker = trade.user;

    if (account !== placer && account !== taker) return;

    this.refreshTradeTakerBalances(trade);
    this.refreshTradePlacerBalances(trade);

    if (account !== taker) return;

    this.props.exchange.setOrderFilling(false);
  }

  /**
   * @param {FilledOrder} trade
   */
  refreshTradePlacerBalances(trade) {
    let guilAmount, ethAmount;

    if (trade.isBuy) {
      guilAmount = trade.offer.amount.negated();
      ethAmount = trade.demand.amount;
    } else {
      guilAmount = trade.demand.amount;
      ethAmount = trade.offer.amount.negated();
    }

    this.props.exchange.addToGuilBalance(guilAmount);
    this.props.exchange.addToEthBalance(ethAmount);
  }

  /**
   * @param {FilledOrder} trade
   */
  refreshTradeTakerBalances(trade) {
    let guilAmount, ethAmount;
    const feeAmount = trade.offer.amount.multipliedBy(
      this.props.exchange.feeRate
    );

    if (trade.isBuy) {
      guilAmount = trade.offer.amount.minus(feeAmount);
      ethAmount = trade.demand.amount.negated();
    } else {
      guilAmount = trade.demand.amount.negated();
      ethAmount = trade.offer.amount.minus(feeAmount);
    }

    this.props.exchange.addToGuilBalance(guilAmount);
    this.props.exchange.addToEthBalance(ethAmount);
  }

  async loadGuilTokenContract(web3) {
    const contract = await this.web3Service.getGuilTokenContract(web3);
    this.props.guilToken.setContract(contract);
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
