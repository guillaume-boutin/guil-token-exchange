import { Card } from "../../common/card/Card";
import { CardHeader } from "../../common/card/CardHeader";
import { CardBody } from "../../common/card/CardBody";
import { OrderTables } from "./order-tables";
import { Order } from "./Order";

export const OrderBook = () => {
  return (
    <Card>
      <CardHeader>Order Book</CardHeader>

      <CardBody>
        <OrderTables
          buyOrders={[new Order({ tokenAmount: 1, ethAmount: 2, price: 3 })]}
        />
      </CardBody>
    </Card>
  );
};
