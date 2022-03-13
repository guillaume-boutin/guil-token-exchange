import { Card, CardHeader, CardBody } from "../../common/card";
import { Tabs, Tab, TabList, TabPanel, TabPanels } from "../../common/tabs";
import style from "./NewOrder.module.scss";
import { Context } from "../../../context";
import { ETHER_ADDRESS } from "../../../helpers";
import BigNumber from "bignumber.js";
import { OperationPanel } from "./OperationPanel";
import { Spinner } from "../../common/spinner";
import { useContext } from "react";
import { observer } from "mobx-react-lite";

const _NewOrder = () => {
  const { web3Store, ordersStore, balancesStore } = useContext(Context);

  const isLoading = [
    ordersStore.trades,
    balancesStore.exchangeGuilBalance,
    balancesStore.exchangeEthBalance,
  ].some((d) => d === null);

  const currentPrice = () => {
    const lastTrade =
      [...ordersStore.trades]
        .sort((a, b) => (a.timestamp.isBefore(b.timestamp) ? -1 : 1))
        .slice(-1)[0] ?? null;

    return lastTrade ? lastTrade.order.price.toPrecision(4) : "0";
  };

  const noEthFunds = balancesStore.exchangeEthBalance <= 0;

  const noGuilFunds = balancesStore.exchangeGuilBalance <= 0;

  const placeBuyOrder = (amount, price) => {
    amount = new BigNumber(amount);
    price = new BigNumber(price);

    const offer = {
      contractAddress: ETHER_ADDRESS,
      amount: web3Store.sdk.utils.toWei(
        amount.times(price).toString(),
        "ether"
      ),
    };

    const demand = {
      contractAddress: web3Store.guilTokenContractAddress,
      amount: web3Store.sdk.utils.toWei(amount.toString(), "ether"),
    };

    web3Store.exchangeContract.methods
      .placeOrder(offer, demand)
      .send({ from: web3Store.account })
      .on("transactionHash", (hash) => {});
  };

  const placeSellOrder = (amount, price) => {
    amount = new BigNumber(amount);
    price = new BigNumber(price);

    const offer = {
      contractAddress: web3Store.guilTokenContractAddress,
      amount: web3Store.sdk.utils.toWei(amount.toString(), "ether"),
    };

    const demand = {
      contractAddress: ETHER_ADDRESS,
      amount: web3Store.sdk.utils.toWei(
        amount.times(price).toString(),
        "ether"
      ),
    };

    web3Store.exchangeContract.methods
      .placeOrder(offer, demand)
      .send({ from: web3Store.account })
      .on("transactionHash", (hash) => {});
  };

  return (
    <Card>
      <CardHeader>
        <h3>New Order</h3>
      </CardHeader>

      <CardBody className={style.carbBody}>
        {isLoading && <Spinner />}

        {!isLoading && (
          <Tabs className={style.tabs}>
            <TabList as="nav">
              <Tab as="a">Buy</Tab>

              <Tab as="a">Sell</Tab>
            </TabList>

            <TabPanels as="div">
              <TabPanel as="div" className={style.tabPanel}>
                {noEthFunds && (
                  <div className={style.noFunds}>
                    You have no ETH funds. Deposit ETH in the Exchange, or sell
                    some GUIL from the Order Book.
                  </div>
                )}

                {!noEthFunds && (
                  <OperationPanel
                    operation="buy"
                    currentPrice={currentPrice()}
                    maxPayingAmount={balancesStore.exchangeEthBalance}
                    onSubmit={placeBuyOrder}
                  />
                )}
              </TabPanel>

              <TabPanel as="div" className={style.tabPanel}>
                {noGuilFunds && (
                  <div className={style.noFunds}>
                    You have no GUIL funds. Deposit some GUIL in the Exchange,
                    or buy some from the Order Book. first.
                  </div>
                )}

                {!noGuilFunds && (
                  <OperationPanel
                    operation="sell"
                    currentPrice={currentPrice()}
                    maxPayingAmount={balancesStore.exchangeGuilBalance}
                    onSubmit={placeSellOrder}
                  />
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        )}
      </CardBody>
    </Card>
  );
};

export const NewOrder = observer(_NewOrder);
