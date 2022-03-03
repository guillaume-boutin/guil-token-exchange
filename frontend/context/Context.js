import {
  ExchangeConsumer,
  ExchangeProvider,
  Web3Consumer,
  Web3Provider,
} from ".";
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

const ContextConsumer = ({ children }) => (
  <Web3Consumer>
    {(web3) => (
      <ExchangeConsumer>
        {(exchange) => children({ web3, exchange })}
      </ExchangeConsumer>
    )}
  </Web3Consumer>
);

export const connect = (mapContextToProps, Component) => {
  return (props) => (
    <ContextConsumer>
      {(contextProps) => {
        const mergedProps = {
          ...mapContextToProps(contextProps),
          ...props,
        };
        return <Component {...mergedProps} />;
      }}
    </ContextConsumer>
  );
};
