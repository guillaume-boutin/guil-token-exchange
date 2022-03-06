import { Card, CardHeader, CardBody } from "../../common/card";
import { Tabs, Tab, TabList, TabPanel, TabPanels } from "../../common/tabs";
import { TextInput } from "../../common/form";
import { Button } from "../../common/button";
import styles from "./NewOrder.module.scss";
import { useState } from "react";
import { connect } from "../../../context";
import { Token } from "../../../entities";
import { ETHER_ADDRESS } from "../../../helpers";

const _NewOrder = ({ web3, exchange, guilToken }) => {
  const [buyGuilAmount, setBuyGuilAmount] = useState(0);
  const [buyGuilPrice, setBuyGuilPrice] = useState(0);
  const [sellGuilAmount, setSellGuilAmount] = useState(0);
  const [sellGuilPrice, setSellGuilPrice] = useState(0);

  const buyDisabled = buyGuilAmount <= 0 || buyGuilPrice <= 0;

  const sellDisabled = sellGuilAmount <= 0 || sellGuilPrice <= 0;

  const onBuyGuilAmountChange = (e) => {
    setBuyGuilAmount(e.target.value);
  };

  const onBuyGuilPriceChange = (e) => {
    setBuyGuilPrice(e.target.value);
  };

  const onBuyClick = () => {
    placeBuyOrder(buyGuilAmount, buyGuilPrice);
  };

  const onSellGuilAmountChange = (e) => {
    setSellGuilAmount(e.target.value);
  };

  const onSellGuilPriceChange = (e) => {
    setSellGuilPrice(e.target.value);
  };

  const onSellClick = () => {
    placeSellOrder(sellGuilAmount, sellGuilPrice);
  };

  const placeBuyOrder = (amount, price) => {
    const demand = {
      contractAddress: guilToken.contractAddress,
      amount: web3.web3.utils.toWei(amount, "ether"),
    };

    const offer = {
      contractAddress: ETHER_ADDRESS,
      amount: web3.web3.utils.toWei(
        safeMultiply(amount, price).toString(),
        "ether"
      ),
    };

    exchange.contract.methods
      .placeOrder(offer, demand)
      .send({ from: web3.account })
      .on("transactionHash", (hash) => {});

    setBuyGuilAmount(0);
    setBuyGuilPrice(0);
  };

  const placeSellOrder = (amount, price) => {
    const offer = {
      contractAddress: guilToken.contractAddress,
      amount: web3.web3.utils.toWei(amount, "ether"),
    };

    const demand = {
      contractAddress: ETHER_ADDRESS,
      amount: web3.web3.utils.toWei(
        safeMultiply(amount, price).toString(),
        "ether"
      ),
    };

    exchange.contract.methods
      .placeOrder(offer, demand)
      .send({ from: web3.account })
      .on("transactionHash", (hash) => {});

    setSellGuilAmount(0);
    setSellGuilPrice(0);
  };

  const safeMultiply = (x, y) => {
    const xDecimalPart = (x - Math.round(x)).toString().split(".")[1] ?? "";
    const yDecimalPart = (y - Math.round(y)).toString().split(".")[1] ?? "";

    const power = xDecimalPart.length + yDecimalPart.length;

    return Math.round(10 ** power * x * y) / 10 ** power;
  };

  return (
    <Card>
      <CardHeader>New Order</CardHeader>

      <CardBody>
        <Tabs>
          <TabList as="nav">
            <Tab as="a">Buy</Tab>

            <Tab as="a">Sell</Tab>
          </TabList>

          <TabPanels as="div">
            <TabPanel as="div">
              <div>
                <label htmlFor="buy-token-amount-input">
                  Buy Amount (GUIL)
                </label>
              </div>

              <div>
                <TextInput
                  type="number"
                  value={buyGuilAmount}
                  min="0"
                  id="buy-token-amount-input"
                  placeholder="Buy Amount"
                  onChange={onBuyGuilAmountChange}
                />
              </div>

              <div>
                <label htmlFor="buy-token-price-input">Buy Price</label>
              </div>

              <div>
                <TextInput
                  type="number"
                  value={buyGuilPrice}
                  min="0"
                  id="buy-token-price-input"
                  placeholder="Buy Price"
                  onChange={onBuyGuilPriceChange}
                />
              </div>

              <Button
                className={styles.blockButton}
                onClick={onBuyClick}
                disabled={buyDisabled}
              >
                Buy Order
              </Button>
            </TabPanel>

            <TabPanel as="div">
              <div>
                <label htmlFor="sell-token-amount-input">
                  Sell Amount (GUIL)
                </label>
              </div>

              <div>
                <TextInput
                  type="number"
                  value={sellGuilAmount}
                  min="0"
                  id="sell-token-amount-input"
                  placeholder="Sell Amount"
                  onChange={onSellGuilAmountChange}
                />
              </div>

              <div>
                <label htmlFor="sell-token-price-input">Sell Price</label>
              </div>

              <div>
                <TextInput
                  type="number"
                  value={sellGuilPrice}
                  min="0"
                  id="sell-token-price-input"
                  placeholder="Sell Price"
                  onChange={onSellGuilPriceChange}
                />
              </div>

              <Button
                className={styles.blockButton}
                onClick={onSellClick}
                disabled={sellDisabled}
              >
                Sell Order
              </Button>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </CardBody>
    </Card>
  );
};

export const NewOrder = connect(
  ({ web3, exchange, guilToken }) => ({ web3, exchange, guilToken }),
  _NewOrder
);
