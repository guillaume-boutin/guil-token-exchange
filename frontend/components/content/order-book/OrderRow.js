import { Order } from "../../../entities";
import style from "./OrderBook.module.scss";
import { connect } from "../../../context";

/**
 * @param props
 * @param {string} props.account
 * @param {function(Order, string)} props.fillOrder
 * @param {Order} props.order
 */
const _OrderRow = ({ account, fillOrder, order }) => {
  const isSelfOwned = order.user === account;

  const onClick = () => {
    if (isSelfOwned) return;

    fillOrder(order, account);
  };

  const trClasses = `${style.tableRow} ${
    isSelfOwned ? style.selfOwned : ""
  }`.trim();

  return (
    <tr className={trClasses} onClick={onClick}>
      <td>{order.token.unitaryAmount}</td>

      <td className={style[order.transactionType]}>{order.price.toFixed(5)}</td>

      <td>{order.ether.unitaryAmount}</td>
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
