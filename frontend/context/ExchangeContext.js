import React, { createContext, useState } from "react";
import { Component } from "../components";
import { Order, HandledOrder, HandledOrderFactory } from "../entities";

export const ExchangeContext = createContext({});

export const ExchangeConsumer = (props) => (
  <ExchangeContext.Consumer>{props.children}</ExchangeContext.Consumer>
);

export const ExchangeProvider = ({ children }) => {
  const [contract, _setContract] = useState(null);
  const [orders, setOrders] = useState([]);
  const [filledOrders, setFilledOrders] = useState([]);
  const [orderFilling, setOrderFilling] = useState(false);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [orderCancelling, setOrderCancelling] = useState(false);
  const [ethBalance, setEthBalance] = useState(null);
  const [ethBalanceLoading, setEthBalanceLoading] = useState(false);
  const [guilBalance, setGuilBalance] = useState(null);
  const [guilBalanceLoading, setGuilBalanceLoading] = useState(false);

  const setContract = (contract) => {
    contract.events.Cancel({}, (error, event) => {
      addToCancelledOrders(
        new HandledOrderFactory().fromEventValues(event.returnValues)
      );
      setOrderCancelling(false);
    });

    contract.events.Trade({}, (error, event) => {
      addToFilledOrders(
        new HandledOrderFactory().fromEventValues(event.returnValues)
      );
      setOrderFilling(false);
    });

    _setContract(contract);
  };

  const openOrders = orders.filter((order) => {
    let index = filledOrders.findIndex(
      (filledOrder) => filledOrder.order.id === order.id
    );

    if (index > -1) return false;

    return (
      cancelledOrders.findIndex(
        (cancelledOrder) => cancelledOrder.order.id === order.id
      ) === -1
    );
  });

  const addToFilledOrders = (filledOrder) => {
    const index = filledOrders.find(
      (fo) => fo.order.id === filledOrder.order.id
    );
    if (index > -1) return;

    setFilledOrders([filledOrder, ...filledOrders]);
  };

  const addToCancelledOrders = (cancelledOrder) => {
    const index = cancelledOrders.find(
      (co) => co.order.id === cancelledOrder.order.id
    );
    if (index > -1) return;

    setCancelledOrders([cancelledOrder, ...cancelledOrders]);
  };

  const cancelOrder = (order, account) => {
    contract.methods
      .cancelOrder(order.id)
      .send({ from: account })
      .on("transactionHash", (hash) => {
        setOrderCancelling(true);
      })
      .on("error", (error) => {});
  };

  const fillOrder = (order, account) => {
    contract.methods
      .fillOrder(order.id)
      .send({ from: account })
      .on("transactionHash", (hash) => {
        setOrderFilling(true);
      })
      .on("error", (error) => {});
  };

  return (
    <ExchangeContext.Provider
      value={{
        contract,
        setContract,
        orders,
        setOrders,
        filledOrders,
        setFilledOrders,
        cancelledOrders,
        setCancelledOrders,
        ethBalance,
        setEthBalance,
        ethBalanceLoading,
        setEthBalanceLoading,
        guilBalance,
        setGuilBalance,
        guilBalanceLoading,
        setGuilBalanceLoading,
        openOrders,
        cancelOrder,
        orderCancelling,
        setOrderCancelling,
        fillOrder,
        orderFilling,
        setOrderFilling,
        addToFilledOrders,
        addToCancelledOrders,
      }}
    >
      {children}
    </ExchangeContext.Provider>
  );
};

class _ExchangeProvider extends Component {
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
      orderFilling: false,
      ethBalance: null,
      ethBalanceLoading: false,
      guilBalance: null,
      guilBalanceLoading: false,
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
      this.fillOrder,
      this.setOrderFilling,
      this.setEthBalance,
      this.setEthBalanceLoading,
      this.setGuilBalance,
      this.setGuilBalanceLoading,
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
      this.setOrderFilling(false);
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
   * @return {boolean}
   */
  get orderFilling() {
    return this.state.orderFilling;
  }

  /**
   * @param {boolean} orderFilling
   */
  setOrderFilling(orderFilling) {
    this.setState({ orderFilling });
  }

  get ethBalance() {
    return this.state.ethBalance;
  }

  setEthBalance(ethBalance) {
    this.setState({ ethBalance });
  }

  get ethBalanceLoading() {
    return this.state.ethBalanceLoading;
  }

  setEthBalanceLoading(ethBalanceLoading) {
    this.setState({ ethBalanceLoading });
  }

  get guilBalance() {
    return this.state.guilBalance;
  }

  setGuilBalance(guilBalance) {
    this.setState({ guilBalance });
  }

  get guilBalanceLoading() {
    return this.state.guilBalanceLoading;
  }

  setGuilBalanceLoading(guilBalanceLoading) {
    this.setState({ guilBalanceLoading });
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

  cancelOrder(order, account) {
    this.contract.methods
      .cancelOrder(order.id)
      .send({ from: account })
      .on("transactionHash", (hash) => {
        this.setOrderCancelling(true);
      })
      .on("error", (error) => {});
  }

  fillOrder(order, account) {
    this.contract.methods
      .fillOrder(order.id)
      .send({ from: account })
      .on("transactionHash", (hash) => {
        this.setOrderFilling(true);
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
          setFilledOrders: this.setFilledOrders,
          cancelledOrders: this.cancelledOrders,
          setCancelledOrders: this.setCancelledOrders,
          ethBalance: this.ethBalance,
          setEthBalance: this.setEthBalance,
          ethBalanceLoading: this.ethBalanceLoading,
          setEthBalanceLoading: this.setEthBalanceLoading,
          guilBalance: this.guilBalance,
          setGuilBalance: this.setGuilBalance,
          guilBalanceLoading: this.guilBalanceLoading,
          setGuilBalanceLoading: this.setGuilBalanceLoading,
          openOrders: this.openOrders,
          cancelOrder: this.cancelOrder,
          orderCancelling: this.orderCancelling,
          setOrderCancelling: this.setOrderCancelling,
          fillOrder: this.fillOrder,
          orderFilling: this.orderFilling,
          setOrderFilling: this.setOrderFilling,
        }}
      >
        {this.props.children}
      </ExchangeContext.Provider>
    );
  }
}
