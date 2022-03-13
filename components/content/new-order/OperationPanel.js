import { Table } from "../../common/table";
import { TextInput } from "../../common/form";
import { Button } from "../../common/button";
import BigNumber from "bignumber.js";
import style from "./NewOrder.module.scss";
import { useState } from "react";

const OperationPanel = ({
  operation,
  currentPrice,
  maxPayingAmount,
  onSubmit,
}) => {
  const [amount, setAmount] = useState(0);
  const [price, setPrice] = useState(currentPrice);

  const amountLabel =
    operation === "buy" ? "You get (GUIL)" : "You give (GUIL)";

  const inReturnLabel =
    operation === "buy" ? "You pay (ETH)" : "You earn (ETH)";

  const inReturnAmount = new BigNumber(amount).times(new BigNumber(price));

  const exceedsMaxPayingAmount = (() => {
    if (operation === "buy") {
      return inReturnAmount.shiftedBy(18).isGreaterThan(maxPayingAmount);
    }

    return new BigNumber(amount).shiftedBy(18).isGreaterThan(maxPayingAmount);
  })();

  const disabled = amount <= 0 || price <= 0 || exceedsMaxPayingAmount;

  const onAmountChange = (e) => {
    setAmount(+e.target.value);
  };

  const onPriceChange = (e) => {
    setPrice(+e.target.value);
  };

  const _onSubmit = () => {
    onSubmit(amount, price);
  };

  return (
    <Table>
      <tbody>
        <tr>
          <td>
            <label htmlFor="sell-token-amount-input">{amountLabel}</label>
          </td>
        </tr>

        <tr>
          <td>
            <TextInput
              type="number"
              value={amount}
              min="0"
              id="sell-token-amount-input"
              placeholder="Buy Amount"
              onChange={onAmountChange}
            />
          </td>
        </tr>

        <tr>
          <td>
            <label htmlFor="sell-token-price-input">Price (GUIL/ETH)</label>
          </td>
        </tr>

        <tr>
          <td>
            <TextInput
              type="number"
              value={price}
              min="0"
              id="sell-token-price-input"
              placeholder="Sell Price"
              onChange={onPriceChange}
            />
          </td>
        </tr>

        <tr>
          <td>{inReturnLabel}</td>
        </tr>

        <tr>
          <td>{inReturnAmount.toString()}</td>
        </tr>

        <tr>
          <td>
            <Button
              className={style.blockButton}
              onClick={_onSubmit}
              disabled={disabled}
            >
              Place Order
            </Button>
          </td>
        </tr>
      </tbody>
    </Table>
  );
};

export { OperationPanel };
