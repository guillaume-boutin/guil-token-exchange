import styles from "./Table.module.scss";

export const Table = ({ children }) => (
  <table className={styles.table}>{children}</table>
);
