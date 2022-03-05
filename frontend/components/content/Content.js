import { Component } from "../Component";
import styles from "./Content.module.scss";
import { Grid } from ".";
import { connect } from "../../context";

class ContentComponent extends Component {
  constructor(props) {
    super(props);
  }

  get canRenderGrid() {
    return (
      this.props.web3 !== null &&
      this.props.web3Loaded &&
      this.props.exchangeContract !== null &&
      this.props.guiltTokenContract !== null
    );
  }

  render() {
    return (
      <div className={styles.content}>
        {this.canRenderGrid ? <Grid /> : <>Could not load web3</>}
      </div>
    );
  }
}

export const Content = connect(
  ({ web3, exchange, guilToken }) => ({
    web3: web3.web3,
    web3Loaded: web3.web3Loaded,
    exchangeContract: exchange.contract,
    guiltTokenContract: guilToken.contract,
  }),
  ContentComponent
);
