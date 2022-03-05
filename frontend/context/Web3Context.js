import React, { createContext } from "react";
import { Web3Service } from "../services";
import { Component } from "../components";

export const Web3Context = createContext({});

export const Web3Consumer = ({ children }) => (
  <Web3Context.Consumer>{children}</Web3Context.Consumer>
);

export class Web3Provider extends Component {
  /** @private {Web3Service} */ web3Service;

  constructor(props) {
    super(props);

    this.web3Service = new Web3Service();
  }

  initialState(props) {
    return {
      web3: null,
      web3Loaded: false,
      account: null,
      exchangeContract: null,
      ethBalance: null,
      ethBalanceLoading: false,
    };
  }

  boundMethods() {
    return [
      this.setWeb3,
      this.setWeb3Loaded,
      this.setAccount,
      this.setEthBalance,
      this.setEthBalanceLoading,
    ];
  }

  get web3() {
    return this.state.web3;
  }

  setWeb3(web3) {
    this.setState({ web3 });
  }

  /**
   * @return {boolean}
   */
  get web3Loaded() {
    return this.state.web3Loaded;
  }

  /**
   * @param {boolean} web3Loaded
   */
  setWeb3Loaded(web3Loaded) {
    this.setState({ web3Loaded });
  }

  get account() {
    return this.state.account;
  }

  setAccount(account) {
    this.setState({ account });
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

  render() {
    return (
      <Web3Context.Provider
        value={{
          web3: this.state.web3,
          setWeb3: this.setWeb3,
          web3Loaded: this.web3Loaded,
          setWeb3Loaded: this.setWeb3Loaded,
          account: this.account,
          setAccount: this.setAccount,
          ethBalance: this.ethBalance,
          setEthBalance: this.setEthBalance,
          ethBalanceLoading: this.ethBalanceLoading,
          setEthBalanceLoading: this.setEthBalanceLoading,
        }}
      >
        {this.props.children}
      </Web3Context.Provider>
    );
  }
}
