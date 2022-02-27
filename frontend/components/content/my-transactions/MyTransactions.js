import { Card, CardHeader, CardBody } from "../../common/card";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "../../common/tabs";
import { Table } from "../../common/table";

export const MyTransactions = () => {
  return (
    <Card>
      <CardHeader>My Transactions</CardHeader>

      <CardBody>
        <Tabs>
          <TabList as="nav">
            <Tab as="a">Trades</Tab>

            <Tab as="a">Orders</Tab>
          </TabList>

          <TabPanels as="div">
            <TabPanel as="div">
              <Table>
                <thead>
                  <tr>
                    <th>Time</th>

                    <th>GUIL</th>

                    <th>GUIL/ETH</th>
                  </tr>
                </thead>
              </Table>
            </TabPanel>

            <TabPanel as="div">
              <Table>
                <thead>
                  <tr>
                    <th>Amount</th>

                    <th>GUIL/ETH</th>

                    <th>Cancel</th>
                  </tr>
                </thead>
              </Table>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </CardBody>
    </Card>
  );
};
