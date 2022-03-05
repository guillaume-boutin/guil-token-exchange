import { Card, CardBody, CardHeader } from "../../common/card";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "../../common/tabs";
import { DepositPanel, WithdrawPanel } from ".";
import { connect } from "../../../context";
import { Component } from "../../Component";
import { Web3Service } from "../../../services";
import { ETHER_ADDRESS } from "../../../helpers";

class _Balance extends Component {
  constructor(props) {
    super(props);

    this.web3Service = new Web3Service();
  }

  async componentDidMount() {
    await Promise.all([
      this.loadWalletEthBalance(),
      this.loadExchangeEthBalance(),
      this.loadWalletGuilBalance(),
      this.loadExchangeGuilBalance(),
    ]);
  }

  async loadWalletEthBalance() {
    const balance = await this.props.web3.eth.getBalance(this.props.account);
    this.props.setWalletEthBalance(balance);
  }

  async loadExchangeEthBalance() {
    const balance = await this.props.exchangeContract.methods
      .balanceOf(this.props.account, ETHER_ADDRESS)
      .call();
    this.props.setExchangeEthBalance(balance);
  }

  async loadWalletGuilBalance() {
    const balance = this.props.guilTokenContract.methods
      .balanceOf(this.props.account)
      .call();
    this.props.setGuilTokenBalance(balance);
  }

  async loadExchangeGuilBalance() {
    const balance = await this.props.exchangeContract.methods
      .balanceOf(
        this.props.account,
        this.props.guilTokenContract.options.address
      )
      .call();
    this.props.setExchangeGuilBalance(balance);
  }

  render() {
    return (
      <Card>
        <CardHeader>Balance</CardHeader>

        <CardBody>
          <Tabs>
            <TabList as="nav">
              <Tab as="a">Deposit</Tab>

              <Tab as="a">Withdraw</Tab>
            </TabList>
            <TabPanels as="div">
              <TabPanel>
                <DepositPanel />
              </TabPanel>

              <TabPanel>
                <WithdrawPanel />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>
    );
  }
}

export const Balance = connect(
  ({ web3, exchange, guilToken }) => ({
    web3: web3.web3,
    account: web3.account,
    setWalletEthBalance: web3.setEthBalance,
    exchangeContract: exchange.contract,
    setExchangeEthBalance: exchange.setEthBalance,
    setExchangeGuilBalance: exchange.setGuilBalance,
    guilTokenContract: guilToken.contract,
    setGuilTokenBalance: guilToken.setBalance,
  }),
  _Balance
);
