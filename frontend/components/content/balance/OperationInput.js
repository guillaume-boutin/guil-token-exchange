import { TextInput } from "../../common/form";
import { Button } from "../../common/button";

import style from "./Balance.module.scss";
import { useState } from "react";

export const OperationInput = ({ label, onSubmit }) => {
  const [amount, setAmount] = useState(0);

  const onChange = (e) => {
    setAmount(e.target.value);
  };

  const onClick = () => {
    onSubmit(amount);
    setAmount(0);
  };

  return (
    <div className={style.inputRow}>
      <TextInput type="number" value={amount} min={0} onChange={onChange} />

      <Button onClick={onClick} disabled={amount <= 0}>
        {label}
      </Button>
    </div>
  );
};
