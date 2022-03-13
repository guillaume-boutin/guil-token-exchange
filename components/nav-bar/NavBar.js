import styles from "./NavBar.module.scss";
import { Component } from "../Component";
import { connect } from "../../context";

class NavBarComponent extends Component {
  get accountEtherscanUrl() {
    return `https://etherscan.io/address/${this.props.account}`;
  }

  render() {
    return (
      <nav className={styles.navBar}>
        <div className={styles.row}>
          <a href="#" className={styles.brand}>
            GUIL Token Exchange
          </a>

          {this.props.account && (
            <a href={this.accountEtherscanUrl} className={styles.account}>
              {this.props.account}
            </a>
          )}
        </div>
      </nav>
    );
  }
}

export const NavBar = connect(
  ({ web3 }) => ({
    account: web3.account,
  }),
  NavBarComponent
);