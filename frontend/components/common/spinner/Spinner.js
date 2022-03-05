import style from "./Spinner.module.scss";

export const Spinner = ({ className }) => {
  const classes = `${style.spinner} ${className ?? ""}`.trim();

  return (
    <div className={classes}>
      <div />
      <div />
      <div />
      <div />
    </div>
  );
};
