import styles from "./CardHeader.module.scss";

export const CardHeader = (props) => {
  const className = `${styles.cardHeader} ${props.className ?? ""}`.trim();

  return <div className={className}>{props.children}</div>;
};
