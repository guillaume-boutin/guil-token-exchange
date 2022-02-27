import styles from "./CardBody.module.scss";

export const CardBody = ({ children }) => (
  <div className={styles.cardBody}>{children}</div>
);
