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
      balance: null,
    };
  }

  boundMethods() {
    return [this.setContract, this.setBalance];
  }

  get contract() {
    return this.state.contract;
  }

  setContract(contract) {
    this.setState({ contract });
  }

  get balance() {
    return this.state.balance;
  }

  setBalance(balance) {
    this.setState({ balance });
  }

  render() {
    return (
      <GuilTokenContext.Provider
        value={{
          contract: this.contract,
          setContract: this.setContract,
          balance: this.balance,
          setBalance: this.setBalance,
        }}
      >
        {this.props.children}
      </GuilTokenContext.Provider>
    );
  }
}
