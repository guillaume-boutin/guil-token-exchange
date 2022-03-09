import { Order } from "../../../entities";
import style from "./OrderBook.module.scss";
import { connect } from "../../../context";
import BigNumber from "bignumber.js";

/**
 * @param props
 * @param {string} props.account
 * @param {function(Order, string)} props.fillOrder
 * @param {Order} props.order
 * @param {BigNumber} props.guilBalance
 * @param {BigNumber} props.ethBalance
 */
const _OrderRow = ({ account, fillOrder, order, guilBalance, ethBalance }) => {
  const isSelfOwned = order.user === account;

  const isBuy = order.transactionType === "buy";

  const isSell = order.transactionType === "sell";

  const isDisabled = () => {
    if (isSelfOwned) return true;

    if (isBuy) {
      return order.demand.amount.isGreaterThan(ethBalance);
    }

    return order.demand.amount.isGreaterThan(guilBalance);
  };

  const onClick = () => {
    if (isDisabled()) return;

    fillOrder(order, account);
  };

  const trClasses = `${style.tableRow} ${
    isDisabled() ? style.disabled : ""
  }`.trim();

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
    guilBalance: exchange.guilBalance,
    ethBalance: exchange.ethBalance,
  }),
  _OrderRow
);
