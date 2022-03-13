// import { Component } from "../Component";
import { Balance } from "./balance";
import { OrderBook } from "./order-book";
import { PriceChart } from "./price-chart";
// import { Trades } from "./trades";
import { NewOrder } from "./new-order";
// import { MyTransactions } from "./my-transactions";
// import { connect } from "../../context";
import { OrderRepository } from "../../repositories/OrderRepository";
import styles from "./Content.module.scss";
import { useContext, useEffect } from "react";
import { Context } from "../../context";
import { observer } from "mobx-react-lite";
import { ETHER_ADDRESS } from "../../helpers";
import BigNumber from "bignumber.js";

export const _Grid = () => {
  const { web3Store, ordersStore, balancesStore } = useContext(Context);
  const orderRepository = new OrderRepository(web3Store.exchangeContract);

  useEffect(() => {
    Promise.all([
      loadOrders(),
      loadTrades(),
      loadCancelledOrders(),
      loadEthWalletBalance(),
      loadEthExchangeBalance(),
      loadGuilWalletBalance(),
      loadGuilExchangeBalance(),
    ]).then();
  });

  const loadEthWalletBalance = async () => {
    const balance = await web3Store.sdk.eth.getBalance(web3Store.account);

    balancesStore.setWalletEthBalance(new BigNumber(balance));
  };

  const loadEthExchangeBalance = async () => {
    const balance = await web3Store.exchangeContract.methods
      .balanceOf(web3Store.account, ETHER_ADDRESS)
      .call();

    balancesStore.setExchangeEthBalance(new BigNumber(balance));
  };

  const loadGuilWalletBalance = async () => {
    const balance = await web3Store.guilTokenContract.methods
      .balanceOf(web3Store.account)
      .call();

    balancesStore.setWalletGuilBalance(new BigNumber(balance));
  };

  const loadGuilExchangeBalance = async () => {
    const balance = await web3Store.exchangeContract.methods
      .balanceOf(web3Store.account, web3Store.guilTokenContractAddress)
      .call();

    balancesStore.setExchangeGuilBalance(new BigNumber(balance));
  };

  const loadOrders = async () => {
    const orders = await orderRepository.getOrders();
    ordersStore.setOrders(orders);
  };

  const loadTrades = async () => {
    const trades = await orderRepository.getTrades();
    ordersStore.setTrades(trades);
  };

  const loadCancelledOrders = async () => {
    const cancelledOrders = await orderRepository.getCancelledOrders();
    ordersStore.setCancelledOrders(cancelledOrders);
  };

  return (
    <div className={styles.grid}>
      <div className={styles.balance}>
        <Balance />
      </div>

      <div className={styles.orderBook}>
        <OrderBook />
      </div>

      <div className={styles.priceChart}>
        <PriceChart />
      </div>

      {/*<div className={styles.trades}>*/}
      {/*  <Trades />*/}
      {/*</div>*/}

      <div className={styles.newOrder}>
        <NewOrder />
      </div>

      {/*<div className={styles.myTransactions}>*/}
      {/*  <MyTransactions />*/}
      {/*</div>*/}
    </div>
  );
};

export const Grid = observer(_Grid);
