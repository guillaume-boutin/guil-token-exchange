import { Table } from "../../common/table";
import styles from "./styles.module.scss";
import { Component } from "../../Component";
import { Order } from "../../../entities";

/**
 * @param props
 * @param {Order} props.order
 */
const Row = ({ order }) => (
  <tr>
    <td>{order.token.unitaryAmount}</td>

    <td className={styles[order.transactionType]}>{order.price.toFixed(5)}</td>

    <td>{order.ether.unitaryAmount}</td>
  </tr>
);

/**
 * @property {Order[]} props.orders
 */
export class OrderTable extends Component {
  constructor(props) {
    super(props);
  }

  render() {
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
          {this.props.orders.map((order, i) => (
            <Row key={i} order={order} />
          ))}
        </tbody>
      </Table>
    );
  }
}
