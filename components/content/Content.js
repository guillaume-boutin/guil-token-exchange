import styles from "./Content.module.scss";
import { Grid } from ".";
import { useContext } from "react";
import { Context } from "../../context";
import { observer } from "mobx-react-lite";

const _Content = () => {
  const {
    web3Store: { sdk, exchangeContract, guilTokenContract },
  } = useContext(Context);

  const canRender =
    sdk !== null && exchangeContract !== null && guilTokenContract !== null;

  return (
    <div className={styles.content}>
      {canRender ? <Grid /> : <>Could not load web3</>}
    </div>
  );
};

export const Content = observer(_Content);
