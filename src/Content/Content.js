import styled from "styled-components";
import { Balance } from "./Balance";
import { OrderBook } from "./OrderBook";
import { PriceChart } from "./PriceChart";
import { Trades } from "./Trades";
import { NewOrder } from "./NewOrder";
import { MyTransactions } from "./MyTransactions";

const StyledContent = styled.div`
  height: 100%;
  background-color: slategray;
  display: grid;
  grid-template-columns: 1fr 1fr 3fr 1fr;
  grid-template-rows: 1fr 1fr;

  grid-template-areas:
    "balance order-book price-chart trades"
    "new-order order-book my-transactions trades";

  #balance {
    grid-area: balance;
  }

  #order-book {
    grid-area: order-book;
  }

  #price-chart {
    grid-area: price-chart;
  }

  #trades {
    grid-area: trades;
  }

  #new-order {
    grid-area: new-order;
  }

  #my-transactions {
    grid-area: my-transactions;
  }
`;

export const Content = () => (
  <StyledContent>
    <Balance />

    <OrderBook />

    <PriceChart />

    <Trades />

    <NewOrder />

    <MyTransactions />
  </StyledContent>
);
