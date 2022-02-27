import styles from "./NavBar.module.scss";
import { Component } from "../Component";
import { Web3Context } from "../../context";

export class NavBar extends Component {
  get accountEtherscanUrl() {
    return `https://etherscan.io/address/${this.context.account}`;
  }

  render() {
    return (
      <nav className={styles.navBar}>
        <div className={styles.row}>
          <a href="#" className={styles.brand}>
            GUIL Token Exchange
          </a>

          {this.context.account && (
            <a href={this.accountEtherscanUrl} className={styles.account}>
              {this.context.account}
            </a>
          )}
        </div>
      </nav>
    );
  }
}

NavBar.contextType = Web3Context;
