import { Component } from "../Component";
import styles from "./Content.module.scss";
import { Grid } from ".";

export class Content extends Component {
  constructor(props) {
    super(props);
  }

  get canRenderGrid() {
    return (
      this.props.web3 !== null &&
      this.props.web3Loaded &&
      this.props.exchangeContract !== null
    );
  }

  render() {
    return (
      <div className={styles.content}>
        {this.canRenderGrid ? (
          <Grid exchangeContract={this.props.exchangeContract} />
        ) : (
          <>Could not load web3</>
        )}
      </div>
    );
  }
}
