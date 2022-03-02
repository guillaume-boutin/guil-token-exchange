import styles from "./Card.module.scss";

export const Card = (props) => {
  const className = `${styles.card} ${props.className ?? ""}`.trim();

  return <div className={className}>{props.children}</div>;
};
