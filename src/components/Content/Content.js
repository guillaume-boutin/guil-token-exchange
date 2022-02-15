import styled from "styled-components";
import { Card } from "../common/card/card";
import { CardHeader } from "../common/card/card-header";
import { Balance } from "./Balance";
import { OrderBook } from "./OrderBook";
import { PriceChart } from "./PriceChart";
import { Trades } from "./Trades";
import { NewOrder } from "./NewOrder";
import { MyTransactions } from "./MyTransactions";

const StyledContent = styled.div`
  height: 100%;
  background-color: #1d1d1d;
  display: grid;
  grid-template-columns: 1fr 1fr 2fr 1fr;
  grid-template-rows: 1fr 1fr;

  grid-template-areas:
    "balance order-book price-chart trades"
    "new-order order-book my-transactions trades";

  padding: 8px;
  gap: 8px;
`;

const GridCell = styled.div`
  //background-color: #343a40;
`;

const BalanceCell = styled(GridCell)`
  grid-area: balance;
`;

const OrderBookCell = styled(GridCell)`
  grid-area: order-book;
`;

const PriceChartCell = styled(GridCell)`
  grid-area: price-chart;
`;

const TradesCell = styled(GridCell)`
  grid-area: trades;
`;

const NewOrderCell = styled(GridCell)`
  grid-area: new-order;
`;

const MyTransactionsCell = styled(GridCell)`
  grid-area: my-transactions;
`;

export const Content = () => (
  <StyledContent>
    <BalanceCell>
      <Balance />
    </BalanceCell>

    <OrderBookCell>
      <OrderBook />
    </OrderBookCell>

    <PriceChartCell>
      <PriceChart />
    </PriceChartCell>

    <TradesCell>
      <Trades />
    </TradesCell>

    <NewOrderCell>
      <NewOrder />
    </NewOrderCell>

    <MyTransactionsCell>
      <MyTransactions />
    </MyTransactionsCell>
  </StyledContent>
);
