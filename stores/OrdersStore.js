import { Order } from "../entities";
import { HandledOrder } from "../entities";
import { Trade } from "../entities";
import { action, computed, makeObservable, observable } from "mobx";

export class OrdersStore {
  /** @public {Order[]|null} */ orders = null;

  /** @public {HandledOrder[]|null} */ cancelledOrders = null;

  /** @public {Trade[]|null} */ trades = null;

  constructor() {
    makeObservable(this, {
      orders: observable,
      cancelledOrders: observable,
      trades: observable,
      openOrders: computed,
      setOrders: action,
      setCancelledOrders: action,
      setTrades: action,
      addToOrders: action,
      addToCancelledOrders: action,
      addToTrades: action,
    });
  }

  get openOrders() {
    if (!this.orders || !this.trades || !this.cancelledOrders) return [];

    return this.orders.filter((order) => {
      let index = this.trades.findIndex((trade) => trade.order.id === order.id);

      if (index > -1) return false;

      return (
        this.cancelledOrders.findIndex(
          (cancelledOrder) => cancelledOrder.order.id === order.id
        ) === -1
      );
    });
  }

  /**
   * @param {Order[]} orders
   */
  setOrders(orders) {
    this.orders = orders;
  }

  /**
   * @param {HandledOrder[]} cancelledOrders
   */
  setCancelledOrders(cancelledOrders) {
    this.cancelledOrders = cancelledOrders;
  }

  /**
   * @param {Trade[]} trades
   */
  setTrades(trades) {
    this.trades = trades;
  }

  /**
   * @param {Order} order
   */
  addToOrders(order) {
    const index = this.orders?.findIndex((o) => o.id === order.id);

    if (index > -1) return;

    this.setOrders([...this.orders, order]);
  }

  /**
   * @param {HandledOrder} cancelledOrder
   */
  addToCancelledOrders(cancelledOrder) {
    const index = this.cancelledOrders?.findIndex(
      (co) => co.order.id === cancelledOrder.order.id
    );

    if (index > -1) return;

    this.setCancelledOrders([...this.cancelledOrders, cancelledOrder]);
  }

  /**
   * @param {Trade} trade
   */
  addToTrades(trade) {
    const index = this.trades?.findIndex((t) => t.order.id === trade.order.id);

    if (index > -1) return;

    this.setTrades([...this.trades, trade]);
  }
}
