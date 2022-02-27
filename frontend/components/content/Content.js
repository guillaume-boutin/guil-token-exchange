import React, { Component } from "react";
import { Balance } from "./balance";
import { OrderBook } from "./order-book";
import { PriceChart } from "./price-chart";
import { Trades } from "./trades";
import { NewOrder } from "./new-order";
import { MyTransactions } from "./my-transactions";
import styles from "./Content.module.scss";
import { Web3Context } from "../../context";

export class Content extends Component {
  async componentDidMount() {
    await this.context.loadWeb3();
    await this.context.loadAccount();
  }

  render() {
    return (
      <div className={styles.content}>
        {this.context.web3 && (
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

            <div className={styles.trades}>
              <Trades trades={[]} />
            </div>

            <div className={styles.newOrder}>
              <NewOrder />
            </div>

            <div className={styles.myTransactions}>
              <MyTransactions />
            </div>
          </div>
        )}
      </div>
    );
  }
}

Content.contextType = Web3Context;
