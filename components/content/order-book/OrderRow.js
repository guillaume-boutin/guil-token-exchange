import { Order } from "../../../entities";
import style from "./OrderBook.module.scss";
import { Context } from "../../../context";
import { useContext } from "react";

/**
 * @param props
 * @param {Order} props.order
 */
export const OrderRow = ({ order }) => {
  const { web3Store, balancesStore } = useContext(Context);

  const isSelfOwned = order.user === web3Store.account;

  const isBuy = order.transactionType === "buy";

  const isSell = order.transactionType === "sell";

  const isDisabled = () => {
    if (isSelfOwned) return true;

    if (isBuy) {
      return order.demand.amount.isGreaterThan(
        balancesStore.exchangeEthBalance
      );
    }

    return order.demand.amount.isGreaterThan(balancesStore.exchangeGuilBalance);
  };

  /**
   * @param {Order} order
   */
  const fillOrder = (order) => {
    web3Store.exchangeContract.methods
      .fillOrder(order.id)
      .send({ from: web3Store.account })
      .on("transactionHash", (hash) => {})
      .on("error", (error) => {});
  };

  const onClick = () => {
    if (isDisabled()) return;

    fillOrder(order);
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
