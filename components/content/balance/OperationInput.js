import { TextInput } from "../../common/form";
import { Button } from "../../common/button";
import BigNumber from "bignumber.js";
import { useState } from "react";
import style from "./Balance.module.scss";

/**
 * @param props;
 * @param {string} props.label
 * @param {BigNumber} props.max
 * @param {function} props.onSubmit
 */
export const OperationInput = ({ label, max, onSubmit }) => {
  const [amount, setAmount] = useState(0);

  const onChange = (e) => {
    setAmount(e.target.value);
  };

  const onActionClick = () => {
    onSubmit(amount);
    setAmount(0);
  };

  const onAllClick = () => {
    setAmount(max.toNumber());
  };

  const disabled = amount <= 0 || amount > max.toNumber();

  return (
    <div className={style.inputRow}>
      <TextInput
        type="number"
        value={amount}
        min={0}
        max={max.toString()}
        className={style.numberInput}
        onChange={onChange}
      />

      <Button className={style.allButton} onClick={onAllClick}>
        all
      </Button>

      <Button onClick={onActionClick} disabled={disabled}>
        {label}
      </Button>
    </div>
  );
};
