import { NavBar } from "../nav-bar";
import { Content } from "../content";
import styles from "./App.module.scss";
import { ContextConsumer } from "../../context";
import { Component } from "../Component";
import { Web3Service } from "../../services";
import { HandledOrderFactory } from "../../entities";

class AppComponent extends Component {
  /** @private {Web3Service} */ web3Service;

  constructor(props) {
    super(props);

    this.web3Service = new Web3Service();
  }

  initialState(props) {
    return {
      web3: null,
      web3Loaded: false,
      exchangeContract: null,
    };
  }

  async componentDidMount() {
    const web3 = await this.web3Service.loadWeb3();
    if (!web3) return;

    this.props.setWeb3(web3);
    this.setState({ web3, web3Loaded: true });

    await Promise.all([this.loadAccount(), this.loadExchangeContract()]);
  }

  async loadAccount() {
    const account = await this.web3Service.loadAccount();
    this.props.setAccount(account);
    this.setState({ account });
  }

  async loadExchangeContract() {
    const exchangeContract = await this.web3Service.loadExchangeContract();

    exchangeContract.events.Cancel({}, (error, event) => {
      this.props.addToCancelledOrders(
        new HandledOrderFactory().fromEventValues(event.returnValues)
      );
    });

    exchangeContract.events.Trade({}, (error, event) => {
      this.props.addToFilledOrders(
        new HandledOrderFactory().fromEventValues(event.returnValues)
      );
    });

    this.props.setExchangeContract(exchangeContract);
    this.setState({ exchangeContract });
  }

  render() {
    return (
      <div className={styles.app}>
        <NavBar account={this.state.account} />

        <Content
          web3={this.state.web3}
          web3Loaded={this.state.web3Loaded}
          exchangeContract={this.state.exchangeContract}
        />
      </div>
    );
  }
}

export const App = () => (
  <ContextConsumer>
    {({ web3, exchange }) => (
      <AppComponent
        setWeb3={web3.setWeb3}
        setAccount={web3.setAccount}
        setExchangeContract={web3.setExchangeContract}
        addToCancelledOrders={exchange.addToCancelledOrders}
        addToFilledOrders={exchange.addToFilledOrders}
      />
    )}
  </ContextConsumer>
);
