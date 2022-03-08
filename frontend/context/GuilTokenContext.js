import React, { createContext, useState } from "react";
import BigNumber from "bignumber.js";

export const GuilTokenContext = createContext({});

export const GuilTokenConsumer = ({ children }) => (
  <GuilTokenContext.Consumer>{children}</GuilTokenContext.Consumer>
);

export const GuilTokenProvider = ({ children }) => {
  const [contract, setContract] = useState(null);
  const [balance, _setBalance] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(false);

  const contractAddress = contract?.options.address;

  const setBalance = (value) => {
    _setBalance(new BigNumber(value));
  };

  const loadBalance = async (account) => {
    setBalanceLoading(true);
    const balance = await contract.methods.balanceOf(account).call();
    setBalance(balance);
    setBalanceLoading(false);
  };

  const addToBalance = (value) => {
    setBalance(balance.plus(value));
  };

  return (
    <GuilTokenContext.Provider
      value={{
        contract,
        setContract,
        contractAddress,
        balance,
        setBalance,
        loadBalance,
        balanceLoading,
        setBalanceLoading,
        addToBalance,
      }}
    >
      {children}
    </GuilTokenContext.Provider>
  );
};
