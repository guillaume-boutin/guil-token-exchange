import React, { createContext } from "react";
import { Component } from "../components";
import { Order, HandledOrder } from "../entities";

export const ExchangeContext = createContext({});

// export const ExchangeConsumer = ({ children }) => (
//   <ExchangeContext.Consumer>{children}</ExchangeContext.Consumer>
// );

export const ExchangeConsumer = (props) => (
  <ExchangeContext.Consumer>{props.children}</ExchangeContext.Consumer>
);

export class ExchangeProvider extends Component {
  constructor(props) {
    super(props);
  }

  initialState(props) {
    return {
      orders: [],
      filledOrders: [],
      cancelledOrders: [],
    };
  }

  boundMethods() {
    return [this.setOrders, this.setFilledOrders, this.setCancelledOrders];
  }

  /**
   * @returns {Order[]}
   */
  get orders() {
    return this.state.orders;
  }

  /**
   * @param {Order[]} orders
   */
  setOrders(orders) {
    this.setState({ orders });
  }

  /**
   * @returns {HandledOrder[]}
   */
  get filledOrders() {
    return this.state.filledOrders;
  }

  /**
   * @param {HandledOrder[]} filledOrders
   */
  setFilledOrders(filledOrders) {
    console.log("set filled orders", filledOrders.length);
    this.setState({ filledOrders });
  }

  /**
   * @returns {HandledOrder[]}
   */
  get cancelledOrders() {
    return this.state.cancelledOrders;
  }

  /**
   * @param {HandledOrder[]} cancelledOrders
   */
  setCancelledOrders(cancelledOrders) {
    console.log("set cancelled orders", cancelledOrders.length);
    this.setState({ cancelledOrders });
  }

  /**
   * @returns {Order[]}
   */
  get openOrders() {
    return this.orders.filter((order) => {
      let index = this.filledOrders.findIndex(
        (filledOrder) => filledOrder.order.id === order.id
      );

      if (index > -1) return false;

      return (
        this.cancelledOrders.findIndex(
          (cancelledOrder) => cancelledOrder.order.id === order.id
        ) === -1
      );
    });
  }

  /**
   * @param {HandledOrder} filledOrder
   */
  addFilledOrder(filledOrder) {
    const index = this.filledOrders.find(
      (fo) => fo.order.id === filledOrder.order.id
    );
    if (index > -1) return;

    this.setFilledOrders([filledOrder, ...this.filledOrders]);
  }

  addCancelledOrder(cancelledOrder) {
    const index = this.cancelledOrders.find(
      (co) => co.order.id === cancelledOrder.order.id
    );
    if (index > -1) return;

    this.setCancelledOrders([cancelledOrder, ...this.cancelledOrders]);
  }

  render() {
    return (
      <ExchangeContext.Provider
        value={{
          orders: this.orders,
          setOrders: this.setOrders,
          filledOrders: this.filledOrders,
          openOrders: this.openOrders,
          setFilledOrders: this.setFilledOrders,
          cancelledOrders: this.cancelledOrders,
          setCancelledOrders: this.setCancelledOrders,
        }}
      >
        {this.props.children}
      </ExchangeContext.Provider>
    );
  }
}
