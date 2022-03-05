import React, { createContext } from "react";
import { Component } from "../components";

export const GuilTokenContext = createContext({});

export const GuilTokenConsumer = ({ children }) => (
  <GuilTokenContext.Consumer>{children}</GuilTokenContext.Consumer>
);

export class GuilTokenProvider extends Component {
  constructor(props) {
    super(props);
  }

  initialState(props) {
    return {
      contract: null,
      contractAddress: null,
      balance: null,
      balanceLoading: false,
    };
  }

  boundMethods() {
    return [this.setContract, this.setBalance, this.setBalanceLoading];
  }

  get contract() {
    return this.state.contract;
  }

  setContract(contract) {
    this.setState({ contract });
  }

  get contractAddress() {
    return this.contract?.options.address ?? null;
  }

  get balance() {
    return this.state.balance;
  }

  setBalance(balance) {
    this.setState({ balance });
  }

  get balanceLoading() {
    return this.state.balanceLoading;
  }

  setBalanceLoading(balanceLoading) {
    return this.setState({ balanceLoading });
  }

  render() {
    return (
      <GuilTokenContext.Provider
        value={{
          contract: this.contract,
          setContract: this.setContract,
          contractAddress: this.contractAddress,
          balance: this.balance,
          setBalance: this.setBalance,
          balanceLoading: this.balanceLoading,
          setBalanceLoading: this.setBalanceLoading,
        }}
      >
        {this.props.children}
      </GuilTokenContext.Provider>
    );
  }
}
