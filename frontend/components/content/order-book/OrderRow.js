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

  const isBuy = order.transactionType === "buy";

  const isSell = order.transactionType === "sell";

  const formattedGuilAmount = (amount) => {
    amount = amount.shiftedBy(-18);
    if (isSell) amount = amount.negated();

    return amount.toString();
  };

  const formattedEthAmount = (amount) => {
    amount = amount.shiftedBy(-18);
    if (isBuy) amount = amount.negated();

    return amount.toString();
  };

  const formattedPrice =
    order.price > 10000
      ? order.price.toFixed(0)
      : order.price.toPrecision(4).toString();

  return (
    <tr className={trClasses} onClick={onClick}>
      <td className={style[isBuy ? "buy" : "sell"]}>
        {formattedGuilAmount(order.token.amount)}
      </td>

      <td>{formattedPrice}</td>

      <td className={style[isBuy ? "sell" : "buy"]}>
        {formattedEthAmount(order.ether.amount)}
      </td>
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
