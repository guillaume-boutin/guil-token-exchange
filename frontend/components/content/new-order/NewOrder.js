import { Card, CardHeader, CardBody } from "../../common/card";
import { Tabs, Tab, TabList, TabPanel, TabPanels } from "../../common/tabs";
import { TextInput } from "../../common/form/TextInput";
import { Button } from "../../common/button";
import styles from "./NewOrder.module.scss";

export const NewOrder = () => {
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
                  type="text"
                  id="buy-token-amount-input"
                  placeholder="Buy Amount"
                />
              </div>

              <div>
                <label htmlFor="buy-token-price-input">Buy Price</label>
              </div>

              <div>
                <TextInput
                  type="text"
                  id="buy-token-price-input"
                  placeholder="Buy Price"
                />
              </div>

              <Button className={styles.blockButton}>Buy Order</Button>
            </TabPanel>

            <TabPanel as="div">
              <div>
                <label htmlFor="sell-token-amount-input">
                  Sell Amount (GUIL)
                </label>
              </div>

              <div>
                <TextInput
                  type="text"
                  id="sell-token-amount-input"
                  placeholder="Sell Amount"
                />
              </div>

              <div>
                <label htmlFor="sell-token-price-input">Sell Price</label>
              </div>

              <div>
                <TextInput
                  type="text"
                  id="sell-token-price-input"
                  placeholder="Sell Price"
                />
              </div>

              <Button>Sell Order</Button>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </CardBody>
    </Card>
  );
};
