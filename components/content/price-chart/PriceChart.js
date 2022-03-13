import { Card, CardBody, CardHeader } from "../../common/card";
import styles from "./PriceChart.module.scss";
import dynamic from "next/dynamic";
import { chartOptions, dummyData } from "./config";
import _groupBy from "lodash/groupBy";
import moment from "moment";
import { Spinner } from "../../common/spinner";
import { useContext } from "react";
import { Context } from "../../../context";
import { observer } from "mobx-react-lite";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const PriceChartComponent = () => {
  const { ordersStore } = useContext(Context);

  const isLoading = ordersStore.trades === null;

  const groupedTrades = _groupBy(ordersStore.trades, (t) =>
    t.timestamp.startOf("hour").unix()
  );

  const candlesticks = (() => {
    return Object.values(groupedTrades).map((trades) => {
      const timeSort = [...trades].sort((a, b) =>
        a.timestamp.isBefore(b.timestamp) ? -1 : 1
      );
      const priceSort = [...trades].sort(
        (a, b) => a.order.price - b.order.price
      );

      return [
        timeSort[0].order.price.precision(4),
        priceSort[priceSort.length - 1].order.price.precision(4),
        priceSort[0].order.price.precision(4),
        timeSort[timeSort.length - 1].order.price.precision(4),
      ];
    });
  })();

  const serie = Object.keys(groupedTrades).map((unixTimestamp, index) => ({
    x: moment.unix(unixTimestamp),
    y: candlesticks[index],
  }));

  const lastTwoTrades = [...ordersStore.trades]
    .sort((a, b) => (a.timestamp.isBefore(b.timestamp) ? -1 : 1))
    .slice(-2);

  const lastTrade = lastTwoTrades[1] ?? null;

  const lastPrice = lastTrade ? lastTrade.order.price.toPrecision(4) : "";

  const lastPriceChange = (() => {
    if (lastTwoTrades.length !== 2) return 0;

    const [secondLastTrade, lastTrade] = lastTwoTrades;

    return lastTrade.order.price
      .minus(secondLastTrade.order.price)
      .toPrecision(4);
  })();

  const caret =
    lastPriceChange < 0 ? (
      <span className={styles.sell}>&#9660;</span>
    ) : (
      <span className={styles.buy}>&#9650;</span>
    );

  return (
    <Card className={styles.card}>
      <CardHeader>
        <h3>Price Chart</h3>
      </CardHeader>

      <CardBody className={styles.cardBody}>
        {isLoading && <Spinner />}

        {!isLoading && (
          <>
            <h4 className={styles.priceTitle}>
              GUIL/ETH {caret} {lastPrice}
            </h4>

            <div className={styles.priceChart}>
              <Chart
                options={chartOptions}
                series={[{ data: serie }]}
                type="candlestick"
                height="100%"
              />
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
};

export const PriceChart = observer(PriceChartComponent);
