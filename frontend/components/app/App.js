import React, { Component } from "react";
import { Header } from "../header";
import { Content } from "../content";
import styles from "./App.module.scss";
import { Web3Context, Web3Provider } from "../../context";

export class App extends Component {
  render() {
    return (
      <Web3Provider>
        <div className={styles.app}>
          <Header />

          <Content />
        </div>
      </Web3Provider>
    );
  }
}
