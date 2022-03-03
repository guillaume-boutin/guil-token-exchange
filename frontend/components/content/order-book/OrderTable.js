import { Table } from "../../common/table";
import { Order } from "../../../entities";
import { OrderRow } from ".";
import styles from "./OrderBook.module.scss";

/**
 * @param props
 * @param {Order[]} props.orders
 */
export const OrderTable = ({ orders }) => {
  const onOrderRowClick = (order) => {};

  return (
    <Table>
      <thead>
        <tr>
          <th>GUIL</th>

          <th>GUIL/ETH</th>

          <th>ETH</th>
        </tr>
      </thead>

      <tbody>
        {orders.map((order, i) => (
          <OrderRow key={i} order={order} />
        ))}
      </tbody>
    </Table>
  );
};
