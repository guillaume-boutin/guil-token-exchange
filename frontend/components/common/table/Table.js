import styles from "./Table.module.scss";

export const Table = (props) => {
  const className = `${styles.table} ${props.className}`;

  return <table className={className}>{props.children}</table>;
};
