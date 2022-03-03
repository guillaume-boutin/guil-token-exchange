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

class GridComponent extends Component {
  /** @private {OrderRepository} */ orderRepository;

  constructor(props) {
    super(props);

    this.orderRepository = new OrderRepository(props.exchangeContract);
  }

  async componentDidMount() {
    await Promise.all([
      this.loadOrders(),
      this.loadFilledOrders(),
      this.loadCancelledOrders(),
    ]);
  }

  async loadOrders() {
    const orders = await this.orderRepository.getOrders();
    this.props.setOrders(orders);
  }

  async loadFilledOrders() {
    const filledOrders = await this.orderRepository.getFilledOrders();
    this.props.setFilledOrders(filledOrders);
  }

  async loadCancelledOrders() {
    const cancelledOrders = await this.orderRepository.getCancelledOrders();
    this.props.setCancelledOrders(cancelledOrders);
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

export const Grid = connect(
  ({ exchange }) => ({
    exchangeContract: exchange.contract,
    setOrders: exchange.setOrders,
    setFilledOrders: exchange.setFilledOrders,
    setCancelledOrders: exchange.setCancelledOrders,
  }),
  GridComponent
);
