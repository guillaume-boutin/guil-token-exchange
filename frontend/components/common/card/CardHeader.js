import styles from "./CardHeader.module.scss";

export const CardHeader = ({ children }) => (
  <div className={styles.cardHeader}>{children}</div>
);
