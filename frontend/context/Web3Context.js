import React, { createContext } from "react";
import { Web3Service } from "../services";
import { Component } from "../components";

export const Web3Context = createContext({});

export const Web3Consumer = ({ children }) => (
  <Web3Context.Consumer>{children}</Web3Context.Consumer>
);

// export const Web3Consumer = Web3Context.Consumer;

export class Web3Provider extends Component {
  /** @private {Web3Service} */ web3Service;

  constructor(props) {
    super(props);

    this.web3Service = new Web3Service();
  }

  initialState(props) {
    return {
      web3: null,
      account: null,
      exchangeContract: null,
    };
  }

  boundMethods() {
    return [this.setWeb3, this.setAccount, this.setExchangeContract];
  }

  get web3() {
    return this.state.web3;
  }

  setWeb3(web3) {
    this.setState({ web3 });
  }

  get account() {
    return this.state.account;
  }

  setAccount(account) {
    this.setState({ account });
  }

  get exchangeContract() {
    return this.state.exchangeContract;
  }

  setExchangeContract(exchangeContract) {
    this.setState({ exchangeContract });
  }

  render() {
    return (
      <Web3Context.Provider
        value={{
          web3: this.state.web3,
          setWeb3: this.setWeb3,
          account: this.account,
          setAccount: this.setAccount,
          exchangeContract: this.exchangeContract,
          setExchangeContract: this.setExchangeContract,
        }}
      >
        {this.props.children}
      </Web3Context.Provider>
    );
  }
}
