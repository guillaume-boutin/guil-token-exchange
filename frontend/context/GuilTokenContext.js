import React, { createContext, useState } from "react";

export const GuilTokenContext = createContext({});

export const GuilTokenConsumer = ({ children }) => (
  <GuilTokenContext.Consumer>{children}</GuilTokenContext.Consumer>
);

export const GuilTokenProvider = ({ children }) => {
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(false);

  const contractAddress = contract?.options.address;

  const loadBalance = async (account) => {
    setBalanceLoading(true);
    const balance = await contract.methods.balanceOf(account).call();
    setBalance(balance);
    setBalanceLoading(false);
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
      }}
    >
      {children}
    </GuilTokenContext.Provider>
  );
};
