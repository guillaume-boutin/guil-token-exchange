import { Card } from "../../common/card/Card";
import { CardHeader } from "../../common/card/CardHeader";
import { CardBody } from "../../common/card/CardBody";
import { Tabs } from "../../common/tabs/Tabs";
import { Tab, TabList, TabPanel, TabPanels } from "@reach/tabs";
import { TextInput } from "../../common/form/text-input";
import styled from "styled-components";
import { Button } from "../../common/button/button";

const BlockButton = styled(Button)`
  display: block;
  width: 100%;
`;

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

              <BlockButton>Buy Order</BlockButton>
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

              <BlockButton>Sell Order</BlockButton>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </CardBody>
    </Card>
  );
};
