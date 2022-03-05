import { NavBar } from "../nav-bar";
import { Content } from "../content";
import styles from "./App.module.scss";
import { connect, ContextConsumer } from "../../context";
import { Component } from "../Component";
import { Web3Service } from "../../services";
import { HandledOrderFactory } from "../../entities";

class AppComponent extends Component {
  /** @private {Web3Service} */ web3Service;

  constructor(props) {
    super(props);

    this.web3Service = new Web3Service();
  }

  async componentDidMount() {
    const web3 = await this.web3Service.getWeb3();
    if (!web3) return;

    this.props.setWeb3(web3);
    this.props.setWeb3Loaded(true);

    await Promise.all([
      this.loadAccount(web3),
      this.loadExchangeContract(web3),
      this.loadGuilTokenContract(web3),
    ]);
  }

  async loadAccount(web3) {
    const account = await this.web3Service.getAccount(web3);
    this.props.setAccount(account);
  }

  async loadExchangeContract(web3) {
    const contract = await this.web3Service.getExchangeContract(web3);
    this.props.setExchangeContract(contract);
  }

  async loadGuilTokenContract(web3) {
    const contract = await this.web3Service.getGuilTokenContract(web3);
    this.props.setGuilTokenContract(contract);
  }

  render() {
    return (
      <div className={styles.app}>
        <NavBar />

        <Content />
      </div>
    );
  }
}

export const App = connect(
  ({ web3, exchange, guilToken }) => ({
    setWeb3: web3.setWeb3,
    setWeb3Loaded: web3.setWeb3Loaded,
    setAccount: web3.setAccount,
    setExchangeContract: exchange.setContract,
    addToCancelledOrders: exchange.addToCancelledOrders,
    addToFilledOrders: exchange.addToFilledOrders,
    setGuilTokenContract: guilToken.setContract,
  }),
  AppComponent
);
