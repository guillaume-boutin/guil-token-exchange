import { Component } from "../Component";
import { Balance } from "./balance";
import { OrderBook } from "./order-book";
import { PriceChart } from "./price-chart";
import { Trades } from "./trades";
import { NewOrder } from "./new-order";
import { MyTransactions } from "./my-transactions";
import { connect } from "../../context";
import { OrderRepository } from "../../repositories/OrderRepository";
import styles from "./Content.module.scss";

class _Grid extends Component {
  /** @private {OrderRepository} */ orderRepository;

  constructor(props) {
    super(props);

    this.orderRepository = new OrderRepository(props.exchange.contract);
  }

  async componentDidMount() {
    await Promise.all([
      this.loadOrders(),
      this.loadTrades(),
      this.loadCancelledOrders(),
    ]);
  }

  async loadOrders() {
    this.props.exchange.setOrdersLoading(true);
    const orders = await this.orderRepository.getOrders();
    this.props.exchange.setOrders(orders);
    this.props.exchange.setOrdersLoading(false);
  }

  async loadTrades() {
    this.props.exchange.setTradesLoading(true);
    const trades = await this.orderRepository.getTrades();
    this.props.exchange.setTrades(trades);
    this.props.exchange.setTradesLoading(false);
  }

  async loadCancelledOrders() {
    this.props.exchange.setCancelledOrdersLoading(true);
    const cancelledOrders = await this.orderRepository.getCancelledOrders();
    this.props.exchange.setCancelledOrders(cancelledOrders);
    this.props.exchange.setCancelledOrdersLoading(false);
  }

  render() {
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

        <div className={styles.trades}>
          <Trades />
        </div>

        <div className={styles.newOrder}>
          <NewOrder />
        </div>

        <div className={styles.myTransactions}>
          <MyTransactions />
        </div>
      </div>
    );
  }
}

export const Grid = connect(({ exchange }) => ({ exchange }), _Grid);
