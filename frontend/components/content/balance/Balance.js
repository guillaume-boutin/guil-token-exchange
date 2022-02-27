import { Card, CardBody, CardHeader } from "../../common/card";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "../../common/tabs";
import { DepositPanel, WithdrawPanel } from ".";

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
};
