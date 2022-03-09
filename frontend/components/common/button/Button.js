import styles from "./Button.module.scss";

export const Button = ({
  children,
  className = "",
  onClick,
  disabled = false,
  ...props
}) => {
  return (
    <button
      className={`${styles.button} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
