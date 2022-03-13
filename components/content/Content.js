import styles from "./Content.module.scss";
import { Grid } from ".";

export const Content = ({ sdk, exchangeContract, guilTokenContract }) => {
  const canRender =
    sdk !== null || exchangeContract !== null || guilTokenContract !== null;

  return (
    <div className={styles.content}>
      {/*{canRender ? <>Can Render</> : <>Could not load web3</>}*/}
      {canRender ? <Grid /> : <>Could not load web3</>}
    </div>
  );
};
