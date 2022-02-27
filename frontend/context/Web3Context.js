import React, { createContext } from "react";
import Web3 from "web3";
import { Web3Service } from "../services/Web3Service";
import { Component } from "../components";

export const Web3Context = createContext({});

export const Web3Consumer = Web3Context.Consumer;

export class Web3Provider extends Component {
  constructor(props) {
    super(props);

    this.web3Servive = new Web3Service();
  }

  initialState(props) {
    return {
      web3: null,
      account: null,
    };
  }

  boundMethods() {
    return [this.loadWeb3, this.loadAccount];
  }

  async loadWeb3() {
    const web3 = await this.web3Servive.get();
    this.setState({ web3 });
  }

  async loadAccount() {
    const [account] = await this.state.web3.eth.getAccounts();
    this.setState({ account });
  }

  render() {
    return (
      <Web3Context.Provider
        value={{
          web3: this.state.web3,
          account: this.state.account,
          loadWeb3: this.loadWeb3,
          loadAccount: this.loadAccount,
        }}
      >
        {this.props.children}
      </Web3Context.Provider>
    );
  }
}
