import React, { Component, createContext } from "react";
import Web3 from "web3";
import { Web3Service } from "../services/Web3Service";

export const Web3Context = createContext({});

export const Web3Consumer = Web3Context.Consumer;

export class Web3Provider extends Component {
  constructor(props) {
    super(props);

    this.web3Servive = new Web3Service();

    this.state = {
      web3: null,
    };
  }

  async loadWeb3() {
    console.log("loading web3...");
    const web3 = await this.web3Servive.get();
    console.log(web3);
    this.setState({ web3 });
  }

  render() {
    return (
      <Web3Context.Provider
        value={{ web3: this.state.web3, loadWeb3: this.loadWeb3.bind(this) }}
      >
        {this.props.children}
      </Web3Context.Provider>
    );
  }
}
