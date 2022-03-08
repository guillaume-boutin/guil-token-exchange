import { NavBar } from "../nav-bar";
import { Content } from "../content";
import styles from "./App.module.scss";
import { connect } from "../../context";
import { Component } from "../Component";
import { Web3Service } from "../../services";
import { HandledOrderFactory, OrderFactory } from "../../entities";
import { ETHER_ADDRESS } from "../../helpers";

class AppComponent extends Component {
  /** @private {Web3Service} */ web3Service;

  constructor(props) {
    super(props);

    this.web3Service = new Web3Service();
  }

  async componentDidMount() {
    const web3 = await this.web3Service.getWeb3();
    if (!web3) return;

    this.props.web3.setWeb3(web3);
    this.props.web3.setWeb3Loaded(true);

    await Promise.all([
      this.loadAccount(web3),
      this.loadExchangeContract(web3),
      this.loadGuilTokenContract(web3),
    ]);
  }

  async loadAccount(web3) {
    const account = await this.web3Service.getAccount(web3);
    this.props.web3.setAccount(account);
  }

  async loadExchangeContract(web3) {
    const contract = await this.web3Service.getExchangeContract(web3);

    contract.events.Deposit({}, async (error, event) => {
      const tokenAddress = event.returnValues.token.contractAddress;

      if (tokenAddress === ETHER_ADDRESS) {
        this.props.exchange.addToEthBalance(event.returnValues.token.amount);
        await this.props.web3.loadEthBalance();
      } else {
        this.props.guilToken.addToBalance(
          `-${event.returnValues.token.amount}`
        );
        this.props.exchange.addToGuilBalance(event.returnValues.token.amount);
      }

      this.props.exchange.setBalancesLoading(false);
    });

    contract.events.Withdraw({}, async (error, event) => {
      const tokenAddress = event.returnValues.token.contractAddress;

      if (tokenAddress === ETHER_ADDRESS) {
        this.props.exchange.addToEthBalance(
          `-${event.returnValues.token.amount}`
        );
        await this.props.web3.loadEthBalance();
      } else {
        this.props.exchange.addToGuilBalance(
          `-${event.returnValues.token.amount}`
        );
        this.props.guilToken.addToBalance(event.returnValues.token.amount);
      }

      this.props.exchange.setBalancesLoading(false);
    });

    contract.events.Order({}, (error, event) => {
      const order = new OrderFactory().fromEventValues(event.returnValues);

      if (order.offer.isEth) {
        this.props.exchange.addToEthBalance(
          `-${event.returnValues.offer.amount}`
        );
      } else {
        this.props.exchange.addToGuilBalance(
          `-${event.returnValues.offer.amount}`
        );
      }

      this.props.exchange.addToOrders(order);
    });

    contract.events.Cancel({}, (error, event) => {
      const cancelledOrder = new HandledOrderFactory().fromEventValues(
        event.returnValues
      );

      if (cancelledOrder.order.offer.isEth) {
        this.props.exchange.addToEthBalance(cancelledOrder.order.offer.amount);
      } else {
        this.props.exchange.addToGuilBalance(cancelledOrder.order.offer.amount);
      }

      this.props.exchange.addToCancelledOrders(cancelledOrder);
      this.props.exchange.setOrderCancelling(false);
    });

    contract.events.Trade({}, (error, event) => {
      const filledOrder = new HandledOrderFactory().fromEventValues(
        event.returnValues
      );

      if (filledOrder.order.offer.isEth) {
        this.props.exchange.addToEthBalance(
          `-${filledOrder.order.offer.amount}`
        );
      } else {
        this.props.exchange.addToGuilBalance(
          `-${filledOrder.order.offer.amount}`
        );
      }

      this.props.exchange.addToFilledOrders(filledOrder);
      this.props.exchange.setOrderFilling(false);
    });

    this.props.exchange.setContract(contract);
  }

  async loadGuilTokenContract(web3) {
    const contract = await this.web3Service.getGuilTokenContract(web3);
    this.props.guilToken.setContract(contract);
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
    web3,
    exchange,
    guilToken,
  }),
  AppComponent
);
