import { Card, CardBody, CardHeader } from "../../common/card";
import styles from "./PriceChart.module.scss";
import dynamic from "next/dynamic";
import { chartOptions, dummyData } from "./config";
import { connect } from "../../../context";
import { Component } from "../../Component";
import { HandledOrder } from "../../../entities";
import _groupBy from "lodash/groupBy";
import moment from "moment";
import { Spinner } from "../../common/spinner";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

/**
 * @property {HandledOrder[]} props.trades
 * @property {boolean} props.filledOrdersLoading
 */
class PriceChartComponent extends Component {
  get groupedTrades() {
    return _groupBy(this.props.trades, (t) =>
      t.timestamp.startOf("hour").unix()
    );
  }

  get candlesticks() {
    return Object.values(this.groupedTrades).map((trades) => {
      const timeSort = trades.sort((a, b) =>
        a.timestamp.isBefore(b.timestamp) ? -1 : 1
      );
      const priceSort = trades.sort((a, b) => a.order.price - b.order.price);

      return [
        timeSort[0].order.price,
        priceSort[priceSort.length - 1].order.price,
        priceSort[0].order.price,
        timeSort[timeSort.length - 1].order.price,
      ];
    });
  }

  get serie() {
    const candlesticks = this.candlesticks;

    return Object.keys(this.groupedTrades).map((unixTimestamp, index) => ({
      x: moment.unix(unixTimestamp),
      y: candlesticks[index],
    }));
  }

  get lastTwoTrades() {
    return this.props.trades
      .sort((a, b) => (a.timestamp.isBefore(b.timestamp) ? -1 : 1))
      .slice(-2);
  }

  get latestPriceChange() {
    const lastTwoTrades = this.lastTwoTrades;
    if (lastTwoTrades.length !== 2) return 0;

    const [secondLastTrade, lastTrade] = this.lastTwoTrades;

    return lastTrade.order.price - secondLastTrade.order.price;
  }

  get isLoading() {
    return this.props.filledOrdersLoading;
  }

  render() {
    const latestPriceChange = this.latestPriceChange;

    const caret =
      latestPriceChange < 0 ? (
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
          {this.isLoading && <Spinner />}

          {!this.isLoading && (
            <>
              <h4 className={styles.priceTitle}>
                GUIL/ETH {caret} {latestPriceChange.toPrecision(4)}
              </h4>

              <div className={styles.priceChart}>
                <Chart
                  options={chartOptions}
                  series={[{ data: this.serie }]}
                  type="candlestick"
                  height="100%"
                />
              </div>
            </>
          )}
        </CardBody>
      </Card>
    );
  }
}

export const PriceChart = connect(
  ({ exchange }) => ({
    trades: exchange.filledOrders,
    filledOrdersLoading: exchange.filledOrdersLoading,
  }),
  PriceChartComponent
);
