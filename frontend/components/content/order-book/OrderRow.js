import { Order } from "../../../entities";
import styles from "./OrderBook.module.scss";
import { connect } from "../../../context";
import { Component } from "../../Component";

/**
 * @param props
 * @param {string} props.account
 * @param {function(Order, string)} props.fillOrder
 * @param {Order} props.order
 */
const _OrderRow = (props) => {
  const onClick = () => {
    props.fillOrder(props.order, props.account);
  };

  return (
    <tr className={styles.tableRow} onClick={onClick}>
      <td>{props.order.token.unitaryAmount}</td>

      <td className={styles[props.order.transactionType]}>
        {props.order.price.toFixed(5)}
      </td>

      <td>{props.order.ether.unitaryAmount}</td>
    </tr>
  );
};

export const OrderRow = connect(
  ({ web3, exchange }) => ({
    account: web3.account,
    fillOrder: exchange.fillOrder,
  }),
  _OrderRow
);
