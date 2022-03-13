import { NavBar } from "../nav-bar";
import { Content } from "../content";
import styles from "./App.module.scss";
import { connect } from "../../context";
// import { Component } from "../Component";
import { Web3Service } from "../../services";
import {
  HandledOrderFactory,
  OrderFactory,
  TokenFactory,
} from "../../entities";
import { Token } from "../../entities";
import { TradeFactory } from "../../entities/Trade";
import { observer } from "mobx-react-lite";
import { Web3Store } from "../../stores";
import { Context } from "../../context";
import { useContext, useEffect, useState } from "react";

const AppComponent = () => {
  const { web3Store, ordersStore } = useContext(Context);
  const web3Service = new Web3Service();

  const [eventSubscriptions, setEventSubscriptions] = useState([]);

  useEffect(() => {
    load().then();
    return () => {
      unsubscribeAllEvents();
    };
  }, []);

  const load = async () => {
    await loadWeb3Sdk();

    await Promise.all([
      loadAccount(),
      loadExchangeContract(),
      loadGuilTokenContract(),
    ]);
  };

  const loadWeb3Sdk = async () => {
    const sdk = await web3Service.getWeb3();
    if (!sdk) return;

    web3Store.setSdk(sdk);
  };

  const loadAccount = async () => {
    if (!web3Store.sdk) return;

    const account = await web3Service.getAccount(web3Store.sdk);
    web3Store.setAccount(account);
  };

  const loadExchangeContract = async () => {
    if (!web3Store.sdk) return;

    if (web3Store.exchangeContract) return;

    const contract = await web3Service.getExchangeContract(web3Store.sdk);

    // contract.events.Deposit({}, this.onDepositEvent);
    // contract.events.Withdraw({}, this.onWithdrawEvent);
    // contract.events.Order({}, this.onOrderEvent);
    // contract.events.Cancel({}, this.onCancelEvent);
    // contract.events.Trade({}, this.onTradeEvent);

    const orderEventSubscription = contract.events
      .Order({})
      .on("data", onOrderEvent);

    setEventSubscriptions([...eventSubscriptions, orderEventSubscription]);

    web3Store.setExchangeContract(contract);
  };

  const loadGuilTokenContract = async () => {
    if (!web3Store.sdk) return;

    if (web3Store.guilTokenContract) return;

    const contract = await web3Service.getGuilTokenContract(web3Store.sdk);
    web3Store.setGuilTokenContract(contract);
  };

  const unsubscribeAllEvents = () => {
    console.log("unsubscribing", eventSubscriptions);
    eventSubscriptions.forEach((s) => {
      s.unsubscribe();
    });
  };

  // async onDepositEvent(error, event) {
  //   const account = this.props.web3.account;
  //   if (account !== event.returnValues.user) return;
  //
  //   const token = new TokenFactory().fromExchangeTransferEvent(
  //     event.returnValues
  //   );
  //
  //   this.subtractFromWalletBalance(token);
  //   this.addToExchangeBalance(token);
  //   this.props.exchange.setBalancesLoading(false);
  //
  //   if (token.isEth) {
  //     await this.props.web3.loadEthBalance();
  //   }
  // }
  //
  // async onWithdrawEvent(error, event) {
  //   const account = this.props.web3.account;
  //   if (account !== event.returnValues.user) return;
  //
  //   const token = new TokenFactory().fromExchangeTransferEvent(
  //     event.returnValues
  //   );
  //
  //   this.addToWalletBalance(token);
  //   this.subtractFromExchangeBalance(token);
  //
  //   if (token.isEth) {
  //     await this.props.web3.loadEthBalance();
  //   }
  // }
  //
  const onOrderEvent = (event) => {
    const order = new OrderFactory().fromEventValues(event.returnValues);

    ordersStore.addToOrders(order);

    // const account = web3Store.account;
    // if (account !== order.user) return;

    // this.subtractFromExchangeBalance(order.offer);
  };
  //
  // onCancelEvent(error, event) {
  //   const cancelledOrder = new HandledOrderFactory().fromEventValues(
  //     event.returnValues
  //   );
  //   this.props.exchange.addToCancelledOrders(cancelledOrder);
  //
  //   const account = this.props.web3.account;
  //
  //   if (account !== cancelledOrder.order.user) return;
  //
  //   this.addToExchangeBalance(cancelledOrder.order.offer);
  //
  //   this.props.exchange.setOrderCancelling(false);
  // }
  //
  // onTradeEvent(error, event) {
  //   const trade = new TradeFactory().fromEventValues(event.returnValues);
  //   this.props.exchange.addToTrades(trade);
  //
  //   const account = this.props.web3.account;
  //
  //   if (!trade.isActor(account)) return;
  //
  //   this.refreshExchangeBalances(trade);
  //
  //   if (!trade.isTaker(account)) return;
  //
  //   this.props.exchange.setOrderFilling(false);
  // }
  //
  // /**
  //  * @param {Trade} trade
  //  */
  // refreshExchangeBalances(trade) {
  //   const account = this.props.web3.account;
  //   const feeRate = this.props.exchange.feeRate;
  //
  //   const earning = trade.getEarning(account);
  //   const fee = trade.getFee(account, feeRate);
  //
  //   const paying = trade.getPaying(account);
  //
  //   this.addToExchangeBalance(earning.minus(fee));
  //   this.subtractFromExchangeBalance(paying);
  // }
  //
  // /**
  //  * @param {Token} token
  //  */
  // addToWalletBalance(token) {
  //   if (token.isEth) return;
  //
  //   this.props.guilToken.addToBalance(token.amount);
  // }
  //
  // /**
  //  * @param {Token} token
  //  */
  // subtractFromWalletBalance(token) {
  //   if (token.isEth) return;
  //
  //   this.props.guilToken.addToBalance(token.amount.negated());
  // }
  //
  // /**
  //  * @param {Token} token
  //  */
  // addToExchangeBalance(token) {
  //   if (token.isEth) return this.props.exchange.addToEthBalance(token.amount);
  //
  //   this.props.exchange.addToGuilBalance(token.amount);
  // }
  //
  // /**
  //  * @param {Token} token
  //  */
  // subtractFromExchangeBalance(token) {
  //   if (token.isEth)
  //     return this.props.exchange.addToEthBalance(token.amount.negated());
  //
  //   this.props.exchange.addToGuilBalance(token.amount.negated());
  // }

  return (
    <div className={styles.app}>
      <NavBar account={web3Store.account} />

      <Content />
    </div>
  );
};

export const App = observer(AppComponent);
