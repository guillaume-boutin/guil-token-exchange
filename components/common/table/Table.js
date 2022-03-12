import styles from "./Table.module.scss";

export const Table = ({ children, className }) => {
  const classes = `${styles.table} ${className ?? ""}`.trim();

  return <table className={classes}>{children}</table>;
};
