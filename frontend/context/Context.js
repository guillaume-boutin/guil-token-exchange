import {
  ExchangeConsumer,
  ExchangeProvider,
  GuilTokenConsumer,
  GuilTokenProvider,
  Web3Consumer,
  Web3Provider,
} from ".";
import { Component } from "../components";

export class ContextProvider extends Component {
  render() {
    return (
      <Web3Provider>
        <ExchangeProvider>
          <GuilTokenProvider>{this.props.children}</GuilTokenProvider>
        </ExchangeProvider>
      </Web3Provider>
    );
  }
}

const ContextConsumer = ({ children }) => (
  <Web3Consumer>
    {(web3) => (
      <ExchangeConsumer>
        {(exchange) => (
          <GuilTokenConsumer>
            {(guilToken) => {
              return children({ web3, exchange, guilToken });
            }}
          </GuilTokenConsumer>
        )}
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
