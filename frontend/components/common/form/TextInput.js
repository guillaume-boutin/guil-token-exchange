import styles from "./TextInput.module.scss";

export const TextInput = ({
  type = "text",
  value,
  min = null,
  max = null,
  onChange,
  ...props
}) => (
  <input
    type={type}
    value={value}
    min={min}
    max={max}
    className={styles.textInput}
    onChange={onChange}
    {...props}
  />
);
