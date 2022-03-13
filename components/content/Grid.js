// import { Component } from "../Component";
// import { Balance } from "./balance";
// import { OrderBook } from "./order-book";
// import { PriceChart } from "./price-chart";
// import { Trades } from "./trades";
// import { NewOrder } from "./new-order";
// import { MyTransactions } from "./my-transactions";
// import { connect } from "../../context";
import { OrderRepository } from "../../repositories/OrderRepository";
import styles from "./Content.module.scss";
import { useContext, useEffect } from "react";
import { Context } from "../../context";

export const Grid = () => {
  const { web3Store, ordersStore } = useContext(Context);
  const orderRepository = new OrderRepository(web3Store.exchangeContract);

  useEffect(() => {
    Promise.all([loadOrders(), loadTrades(), loadCancelledOrders()]).then();
  }, []);

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
      {/*<div className={styles.balance}>*/}
      {/*  <Balance />*/}
      {/*</div>*/}

      {/*<div className={styles.orderBook}>*/}
      {/*  <OrderBook />*/}
      {/*</div>*/}

      {/*<div className={styles.priceChart}>*/}
      {/*  <PriceChart />*/}
      {/*</div>*/}

      {/*<div className={styles.trades}>*/}
      {/*  <Trades />*/}
      {/*</div>*/}

      {/*<div className={styles.newOrder}>*/}
      {/*  <NewOrder />*/}
      {/*</div>*/}

      {/*<div className={styles.myTransactions}>*/}
      {/*  <MyTransactions />*/}
      {/*</div>*/}
    </div>
  );
};

// export const Grid = connect(({ exchange }) => ({ exchange }), _Grid);
