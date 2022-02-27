import React, { createContext } from "react";
import Web3 from "web3";
import ExchangeJson from "../../backend/abis/Exchange.json";
import { Component } from "../components";

export const ExchangeContext = createContext({});

export const ExchangeConsumer = ExchangeContext.Consumer;

export class ExchangeProvider extends Component {
  constructor(props) {
    super(props);
  }

  initialState(props) {
    return { contract: null };
  }

  boundMethods() {
    return [this.loadContract];
  }

  /**
   * @param web3 {Web3}
   */
  async loadContract(web3) {
    try {
      const networkId = await web3.eth.net.getId();

      const contract = new web3.eth.Contract(
        ExchangeJson.abi,
        ExchangeJson.networks[networkId].address
      );

      this.setState({ contract });
    } catch (e) {}
  }

  render() {
    return (
      <ExchangeContext.Provider
        value={{
          contract: this.state.contract,
          loadContract: this.loadContract,
        }}
      >
        {this.props.children}
      </ExchangeContext.Provider>
    );
  }
}
