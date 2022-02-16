import { Card } from "../../common/card/Card";
import { CardHeader } from "../../common/card/CardHeader";
import { CardBody } from "../../common/card/CardBody";
import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "../../common/tabs/Tabs";
import { Table } from "../../common/table/table";

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
