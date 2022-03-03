import React, { createContext } from "react";
import { Component } from "../components";
import { Order, HandledOrder, HandledOrderFactory } from "../entities";

export const ExchangeContext = createContext({});

export const ExchangeConsumer = (props) => (
  <ExchangeContext.Consumer>{props.children}</ExchangeContext.Consumer>
);

export class ExchangeProvider extends Component {
  constructor(props) {
    super(props);
  }

  initialState(props) {
    return {
      contract: null,
      orders: [],
      filledOrders: [],
      cancelledOrders: [],
      orderCancelling: false,
    };
  }

  boundMethods() {
    return [
      this.setContract,
      this.setOrders,
      this.setFilledOrders,
      this.setCancelledOrders,
      this.cancelOrder,
      this.setOrderCancelling,
    ];
  }

  get contract() {
    return this.state.contract;
  }

  setContract(contract) {
    contract.events.Cancel({}, (error, event) => {
      this.addToCancelledOrders(
        new HandledOrderFactory().fromEventValues(event.returnValues)
      );
      this.setOrderCancelling(false);
    });

    contract.events.Trade({}, (error, event) => {
      this.addToFilledOrders(
        new HandledOrderFactory().fromEventValues(event.returnValues)
      );
    });

    this.setState({ contract });
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
   * @return {boolean}
   */
  get orderCancelling() {
    return this.state.orderCancelling;
  }

  /**
   * @param {boolean} orderCancelling
   */
  setOrderCancelling(orderCancelling) {
    this.setState({ orderCancelling });
  }

  /**
   * @param {HandledOrder} filledOrder
   */
  addToFilledOrders(filledOrder) {
    const index = this.filledOrders.find(
      (fo) => fo.order.id === filledOrder.order.id
    );
    if (index > -1) return;

    this.setFilledOrders([filledOrder, ...this.filledOrders]);
  }

  addToCancelledOrders(cancelledOrder) {
    const index = this.cancelledOrders.find(
      (co) => co.order.id === cancelledOrder.order.id
    );
    if (index > -1) return;

    this.setCancelledOrders([cancelledOrder, ...this.cancelledOrders]);
  }

  cancelOrder(order, fromAccount) {
    this.contract.methods
      .cancelOrder(order.id)
      .send({ from: fromAccount })
      .on("transactionHash", (hash) => {
        this.setOrderCancelling(true);
      })
      .on("error", (error) => {});
  }

  render() {
    return (
      <ExchangeContext.Provider
        value={{
          contract: this.contract,
          setContract: this.setContract,
          orders: this.orders,
          setOrders: this.setOrders,
          filledOrders: this.filledOrders,
          openOrders: this.openOrders,
          setFilledOrders: this.setFilledOrders,
          cancelledOrders: this.cancelledOrders,
          setCancelledOrders: this.setCancelledOrders,
          cancelOrder: this.cancelOrder,
          orderCancelling: this.orderCancelling,
          setOrderCancelling: this.setOrderCancelling,
        }}
      >
        {this.props.children}
      </ExchangeContext.Provider>
    );
  }
}
