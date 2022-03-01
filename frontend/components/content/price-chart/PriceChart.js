import { Card, CardBody, CardHeader } from "../../common/card";
import styles from "./PriceChart.module.scss";
import dynamic from "next/dynamic";
import { chartOptions, dummyData } from "./config";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export const PriceChart = () => {
  return (
    <Card>
      <CardHeader>Price Chart</CardHeader>

      <CardBody>
        <div className={styles.priceChart}>
          <Chart
            options={chartOptions}
            series={dummyData}
            type="candlestick"
            width="100%"
            height="100%"
          />
        </div>
      </CardBody>
    </Card>
  );
};
