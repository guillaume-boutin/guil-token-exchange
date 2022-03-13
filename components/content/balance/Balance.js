import { Card, CardBody, CardHeader } from "../../common/card";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "../../common/tabs";
import { DepositPanel, WithdrawPanel } from ".";
import { Context } from "../../../context";
import { Spinner } from "../../common/spinner";
import style from "./Balance.module.scss";
import { useContext } from "react";
import { observer } from "mobx-react-lite";

const _Balance = () => {
  const {
    balancesStore: {
      walletEthBalance,
      exchangeEthBalance,
      walletGuilBalance,
      exchangeGuilBalance,
    },
  } = useContext(Context);

  const isLoading = [
    walletEthBalance,
    exchangeEthBalance,
    walletGuilBalance,
    exchangeGuilBalance,
  ].some((balance) => balance === null);

  return (
    <Card className={style.card}>
      <CardHeader className={style.cardHeader}>
        <h3>Balance</h3>
      </CardHeader>

      <CardBody className={style.cardBody}>
        {isLoading && <Spinner />}

        {!isLoading && (
          <Tabs>
            <TabList as="nav">
              <Tab as="a">Deposit</Tab>

              <Tab as="a">Withdraw</Tab>
            </TabList>
            <TabPanels as="div">
              <TabPanel>
                <DepositPanel
                  walletEthBalance={walletEthBalance}
                  exchangeEthBalance={exchangeEthBalance}
                  walletGuilBalance={walletGuilBalance}
                  exchangeGuilBalance={exchangeGuilBalance}
                />
              </TabPanel>

              <TabPanel>
                <WithdrawPanel
                  walletEthBalance={walletEthBalance}
                  exchangeEthBalance={exchangeEthBalance}
                  walletGuilBalance={walletGuilBalance}
                  exchangeGuilBalance={exchangeGuilBalance}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        )}
      </CardBody>
    </Card>
  );
};

export const Balance = observer(_Balance);
