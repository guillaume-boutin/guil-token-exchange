import { Card } from "../../common/card/Card";
import { CardHeader } from "../../common/card/CardHeader";
import { TabList, TabPanels, TabPanel, Tab } from "@reach/tabs";
import { Tabs } from "../../common/tabs/Tabs";
import { CardBody } from "../../common/card/CardBody";
import { Table } from "../../common/table/table";
import { TextInput } from "../../common/form/text-input";
import { Button } from "../../common/button/button";
import styled from "styled-components";
import { DepositPanel } from "./deposit-panel";
import { WithdrawPanel } from "./withdraw-panel";

const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
`;

export const Balance = () => {
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
            <TabPanel as="div">
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
};
