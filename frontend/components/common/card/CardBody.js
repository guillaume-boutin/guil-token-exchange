import styles from "./CardBody.module.scss";

export const CardBody = (props) => {
  const className = `${styles.cardBody} ${props.className ?? ""}`.trim();

  return <div className={className}>{props.children}</div>;
};
