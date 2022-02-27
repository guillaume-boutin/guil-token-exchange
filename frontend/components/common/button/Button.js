import styles from "./Button.module.scss";

export const Button = (props) => {
  const className = `${styles.button} ${props.className ?? ""}`.trim();

  return <button className={className}>{props.children}</button>;
};
