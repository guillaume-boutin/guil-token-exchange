import { Component } from "../Component";
import { Balance } from "./balance";
import { OrderBook } from "./order-book";
import { PriceChart } from "./price-chart";
import { Trades } from "./trades";
import { NewOrder } from "./new-order";
import { MyTransactions } from "./my-transactions";
import { ExchangeConsumer } from "../../context";
import styles from "./Content.module.scss";
import { OrderRepository } from "../../repositories/OrderRepository";

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
          <Trades trades={[]} />
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

export const Grid = ({ exchangeContract }) => (
  <ExchangeConsumer>
    {({ setOrders, setFilledOrders, setCancelledOrders }) => (
      <GridComponent
        exchangeContract={exchangeContract}
        setOrders={setOrders}
        setFilledOrders={setFilledOrders}
        setCancelledOrders={setCancelledOrders}
      />
    )}
  </ExchangeConsumer>
);
