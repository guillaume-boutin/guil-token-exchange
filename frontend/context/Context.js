import { Web3Provider, ExchangeProvider } from ".";
import { Component } from "../components";

export class ContextProvider extends Component {
  render() {
    return (
      <Web3Provider>
        <ExchangeProvider>{this.props.children}</ExchangeProvider>
      </Web3Provider>
    );
  }
}
