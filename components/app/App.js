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
import BigNumber from "bignumber.js";

const AppComponent = () => {
  const { web3Store, ordersStore, balancesStore, eventsStore } =
    useContext(Context);
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

    setEventSubscriptions([
      ...eventSubscriptions,
      contract.events.Deposit({}).on("data", onDepositEvent),
      contract.events.Withdraw({}).on("data", onWithdrawEvent),
      contract.events.Order({}).on("data", onOrderEvent),
      contract.events.Cancel({}).on("data", onOrderCancelledEvent),
      contract.events.Trade({}).on("data", onTradeEvent),
    ]);

    await web3Store.setExchangeContract(contract);
  };

  const loadGuilTokenContract = async () => {
    if (!web3Store.sdk) return;

    if (web3Store.guilTokenContract) return;

    const contract = await web3Service.getGuilTokenContract(web3Store.sdk);
    web3Store.setGuilTokenContract(contract);
  };

  const unsubscribeAllEvents = () => {
    eventSubscriptions.forEach((s) => {
      s.unsubscribe();
    });
  };

  const canHandleEvent = (event) => {
    if (eventsStore.has(event)) return false;

    eventsStore.addEvent(event);

    return true;
  };

  const onDepositEvent = async (event) => {
    if (!canHandleEvent(event)) return;

    const account = web3Store.account;
    if (account !== event.returnValues.user) return;

    const token = new TokenFactory().fromExchangeTransferEvent(
      event.returnValues
    );

    balancesStore.addToWallet(token.negated());
    balancesStore.addToExchange(token);

    if (token.isEth) {
      const balance = await web3Store.sdk.eth.getBalance(account);
      balancesStore.setWalletEthBalance(new BigNumber(balance));
    }
  };

  const onWithdrawEvent = async (event) => {
    if (!canHandleEvent(event)) return;

    const account = web3Store.account;
    if (account !== event.returnValues.user) return;

    const token = new TokenFactory().fromExchangeTransferEvent(
      event.returnValues
    );

    balancesStore.addToWallet(token);
    balancesStore.addToExchange(token.negated());

    if (token.isEth) {
      const balance = await web3Store.sdk.eth.getBalance(account);
      balancesStore.setWalletEthBalance(new BigNumber(balance));
    }
  };

  const onOrderEvent = (event) => {
    if (!canHandleEvent(event)) return;

    const order = new OrderFactory().fromEventValues(event.returnValues);

    ordersStore.addToOrders(order);

    const account = web3Store.account;
    if (account !== order.user) return;

    balancesStore.addToExchange(order.offer.negated());
  };

  const onOrderCancelledEvent = (event) => {
    if (!canHandleEvent(event)) return;

    const cancelledOrder = new HandledOrderFactory().fromEventValues(
      event.returnValues
    );

    ordersStore.addToCancelledOrders(cancelledOrder);

    const account = web3Store.account;
    if (account !== cancelledOrder.order.user) return;

    balancesStore.addToExchange(cancelledOrder.order.offer);
  };

  const onTradeEvent = (event) => {
    if (!canHandleEvent(event)) return;

    const trade = new TradeFactory().fromEventValues(event.returnValues);
    ordersStore.addToTrades(trade);

    const account = web3Store.account;

    if (!trade.isActor(account)) return;

    refreshExchangeBalances(trade);
  };

  /**
   * @param {Trade} trade
   */
  const refreshExchangeBalances = (trade) => {
    const account = web3Store.account;
    const feeRate = web3Store.exchangeFeeRate;

    let earning = trade.getEarning(account);

    if (web3Store.exchangeFeeAccount !== trade.taker) {
      const fee = trade.getFee(account, feeRate);
      earning = earning.minus(fee);
    }

    const paying = trade.getPaying(account);

    balancesStore.addToExchange(earning);
    balancesStore.addToExchange(paying.negated());
  };

  return (
    <div className={styles.app}>
      <NavBar account={web3Store.account} />

      <Content />
    </div>
  );
};

export const App = observer(AppComponent);
