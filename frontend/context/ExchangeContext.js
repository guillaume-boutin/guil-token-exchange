import React, { createContext, useState } from "react";
import { ETHER_ADDRESS } from "../helpers";
import BigNumber from "bignumber.js";

export const ExchangeContext = createContext({});

export const ExchangeConsumer = (props) => (
  <ExchangeContext.Consumer>{props.children}</ExchangeContext.Consumer>
);

export const ExchangeProvider = ({ children }) => {
  const [contract, _setContract] = useState(null);
  const [feePercent, _setFeePercent] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [trades, setTrades] = useState([]);
  const [tradesLoading, setTradesLoading] = useState(false);
  const [orderFilling, setOrderFilling] = useState(false);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [cancelledOrdersLoading, setCancelledOrdersLoading] = useState(false);
  const [orderCancelling, setOrderCancelling] = useState(false);
  const [ethBalance, _setEthBalance] = useState(null);
  const [ethBalanceLoading, setEthBalanceLoading] = useState(false);
  const [guilBalance, _setGuilBalance] = useState(null);
  const [guilBalanceLoading, setGuilBalanceLoading] = useState(false);

  const setContract = async (contract) => {
    _setContract(contract);

    const feePercent = await contract.methods.feePercent().call();

    _setFeePercent(feePercent);
  };

  const contractAddress = contract?.options.address ?? null;

  const feeRate = feePercent ? new BigNumber(feePercent).shiftedBy(-4) : null;

  const openOrders = orders.filter((order) => {
    let index = trades.findIndex((trades) => trades.order.id === order.id);

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

  const addToTrades = (trade) => {
    const index = trades.find((fo) => fo.order.id === trade.order.id);
    if (index > -1) return;

    setTrades([trade, ...trades]);
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

  const setEthBalance = (value) => {
    _setEthBalance(new BigNumber(value));
  };

  const loadEthBalance = async (account) => {
    setEthBalanceLoading(true);
    const balance = await contract.methods
      .balanceOf(account, ETHER_ADDRESS)
      .call();
    setEthBalance(balance);
    setEthBalanceLoading(false);
  };

  const setGuilBalance = (value) => {
    _setGuilBalance(new BigNumber(value));
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
    ordersLoading || tradesLoading || cancelledOrdersLoading;

  const addToEthBalance = (value) => {
    setEthBalance(ethBalance.plus(value));
  };

  const addToGuilBalance = (value) => {
    setGuilBalance(guilBalance.plus(value));
  };

  const addToBalance = (token) => {
    if (token.address === ETHER_ADDRESS) {
      return setEthBalance(ethBalance.plus(token.amount));
    }

    setGuilBalance(guilBalance.plus(token.amount));
  };

  const subtractFromBalance = (token) => {
    if (token.address === ETHER_ADDRESS) {
      return setEthBalance(ethBalance.minus(token.amount));
    }

    setGuilBalance(guilBalance.minus(token.amount));
  };

  return (
    <ExchangeContext.Provider
      value={{
        contract,
        setContract,
        contractAddress,
        feeRate,
        orders,
        setOrders,
        ordersLoading,
        setOrdersLoading,
        trades,
        setTrades,
        tradesLoading,
        setTradesLoading,
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
        addToTrades,
        addToCancelledOrders,
        balancesLoading,
        setBalancesLoading,
        anyOrdersLoading,
        addToEthBalance,
        addToGuilBalance,
        addToBalance,
        subtractFromBalance,
      }}
    >
      {children}
    </ExchangeContext.Provider>
  );
};
