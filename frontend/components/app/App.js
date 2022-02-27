import React, { Component } from "react";
import { NavBar } from "../nav-bar";
import { Content } from "../content";
import styles from "./App.module.scss";
import { Web3Context, Web3Provider } from "../../context";
import { ExchangeProvider } from "../../context/ExchangeContext";

export class App extends Component {
  render() {
    return (
      <Web3Provider>
        <ExchangeProvider>
          <div className={styles.app}>
            <NavBar />

            <Content />
          </div>
        </ExchangeProvider>
      </Web3Provider>
    );
  }
}
