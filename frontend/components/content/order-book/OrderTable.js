import { Table } from "../../common/table";
import { Order } from "../../../entities";
import { OrderRow } from ".";

/**
 * @param props
 * @param {Order[]} props.orders
 */
export const OrderTable = ({ orders }) => {
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
        {orders
          .sort((a, b) => a.price - b.price)
          .map((order, i) => (
            <OrderRow key={i} order={order} />
          ))}
      </tbody>
    </Table>
  );
};
