import styles from "./Card.module.scss";

export const Card = ({ className, children }) => {
  const classNames = `${styles.card} ${className ?? ""}`.trim();

  return <div className={classNames}>{children}</div>;
};

export const CardBody = ({ className, children }) => {
  const classNames = `${styles.cardBody} ${className ?? ""}`.trim();

  return <div className={classNames}>{children}</div>;
};

export const CardHeader = ({ className, children }) => {
  const classNames = `${styles.cardHeader} ${className ?? ""}`.trim();

  return <div className={classNames}>{children}</div>;
};
