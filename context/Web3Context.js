import React, { createContext, useState } from "react";
import BigNumber from "bignumber.js";

export const Web3Context = createContext({});

export const Web3Consumer = ({ children }) => (
  <Web3Context.Consumer>{children}</Web3Context.Consumer>
);

export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [web3Loaded, setWeb3Loaded] = useState(false);
  const [account, setAccount] = useState(null);
  const [exchangeContract, setExchangeContract] = useState(null);
  const [ethBalance, _setEthBalance] = useState(null);
  const [ethBalanceLoading, setEthBalanceLoading] = useState(false);

  const loadEthBalance = async () => {
    setEthBalanceLoading(true);
    const balance = await web3.eth.getBalance(account);
    setEthBalance(balance);
    setEthBalanceLoading(false);
  };

  const setEthBalance = (value) => {
    _setEthBalance(new BigNumber(value));
  };

  return (
    <Web3Context.Provider
      value={{
        web3,
        setWeb3,
        web3Loaded,
        setWeb3Loaded,
        account,
        setAccount,
        exchangeContract,
        setExchangeContract,
        ethBalance,
        setEthBalance,
        loadEthBalance,
        ethBalanceLoading,
        setEthBalanceLoading,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
