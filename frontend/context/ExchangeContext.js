import React, { createContext, useState } from "react";
import { HandledOrderFactory } from "../entities";
import { ETHER_ADDRESS } from "../helpers";
import { value } from "lodash/seq";

export const ExchangeContext = createContext({});

export const ExchangeConsumer = (props) => (
  <ExchangeContext.Consumer>{props.children}</ExchangeContext.Consumer>
);

export const ExchangeProvider = ({ children }) => {
  const [contract, _setContract] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [filledOrders, setFilledOrders] = useState([]);
  const [filledOrdersLoading, setFilledOrdersLoading] = useState(false);
  const [orderFilling, setOrderFilling] = useState(false);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [cancelledOrdersLoading, setCancelledOrdersLoading] = useState(false);
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

  const contractAddress = contract?.options.address ?? null;

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

  const addToOrders = (order) => {
    setOrders([...orders, order]);
  };

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

  const loadEthBalance = async (account) => {
    setEthBalanceLoading(true);
    const balance = await contract.methods
      .balanceOf(account, ETHER_ADDRESS)
      .call();
    setEthBalance(balance);
    setEthBalanceLoading(false);
  };

  const loadGuilBalance = async (account, guilTokenAddress) => {
    setGuilBalanceLoading(true);
    const balance = await contract.methods
      .balanceOf(account, guilTokenAddress)
      .call();
    setGuilBalance(balance);
    setGuilBalanceLoading(false);
  };

  const balancesLoading = ethBalanceLoading || guilBalanceLoading;

  const setBalancesLoading = (value) => {
    setEthBalanceLoading(value);
    setGuilBalanceLoading(value);
  };

  const anyOrdersLoading =
    ordersLoading || filledOrdersLoading || cancelledOrdersLoading;

  const addToEthBalance = (value) => {
    setEthBalance((parseInt(value, 10) + parseInt(ethBalance, 10)).toString());
  };

  const addToGuilBalance = (value) => {
    setGuilBalance(
      (parseInt(value, 10) + parseInt(guilBalance, 10)).toString()
    );
  };

  return (
    <ExchangeContext.Provider
      value={{
        contract,
        setContract,
        contractAddress,
        orders,
        setOrders,
        ordersLoading,
        setOrdersLoading,
        filledOrders,
        setFilledOrders,
        filledOrdersLoading,
        setFilledOrdersLoading,
        cancelledOrders,
        setCancelledOrders,
        cancelledOrdersLoading,
        setCancelledOrdersLoading,
        ethBalance,
        setEthBalance,
        loadEthBalance,
        ethBalanceLoading,
        setEthBalanceLoading,
        guilBalance,
        setGuilBalance,
        loadGuilBalance,
        guilBalanceLoading,
        setGuilBalanceLoading,
        openOrders,
        cancelOrder,
        orderCancelling,
        setOrderCancelling,
        fillOrder,
        orderFilling,
        setOrderFilling,
        addToOrders,
        addToFilledOrders,
        addToCancelledOrders,
        balancesLoading,
        setBalancesLoading,
        anyOrdersLoading,
        addToEthBalance,
        addToGuilBalance,
      }}
    >
      {children}
    </ExchangeContext.Provider>
  );
};
