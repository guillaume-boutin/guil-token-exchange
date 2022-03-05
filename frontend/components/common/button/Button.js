import styles from "./Button.module.scss";

export const Button = ({
  children,
  className = "",
  onClick,
  disabled = false,
  ...props
}) => {
  const classes = `${styles.button} ${className ?? ""}`.trim();

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
