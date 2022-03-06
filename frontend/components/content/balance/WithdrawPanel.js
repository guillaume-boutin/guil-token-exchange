import { Table } from "../../common/table";
import { TextInput } from "../../common/form";
import { Button } from "../../common/button";
import web3 from "web3";

import styles from "./Balance.module.scss";
import { OperationInput } from "./OperationInput";
import { connect } from "../../../context";

/**
 * @param props
 * @param {Token} props.walletEthBalance
 * @param {Token} props.exchangeEthBalance
 * @param {Token} props.walletGuilBalance
 * @param {Token} props.exchangeGuilBalance
 */
const _WithdrawPanel = ({
  web3,
  exchange,
  guilToken,
  walletEthBalance,
  exchangeEthBalance,
  walletGuilBalance,
  exchangeGuilBalance,
}) => {
  const onWithdrawEth = async (amount) => {
    await exchange.contract.methods
      .withdrawEther(web3.web3.utils.toWei(amount, "ether"))
      .send({
        from: web3.account,
      })
      .on("transactionHash", (hash) => {
        console.log(hash);
        exchange.setEthBalanceLoading(true);
      })
      .on("error", (error) => {
        console.error(error);
      });
  };

  return (
    <Table>
      <thead>
        <tr>
          <th>Token</th>

          <th>Wallet</th>

          <th>Exchange</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>ETH</td>

          <td>{walletEthBalance.unitaryAmount.toFixed(3)}</td>

          <td>{exchangeEthBalance.unitaryAmount.toFixed(3)}</td>
        </tr>

        <tr>
          <td colSpan="3">
            <OperationInput label="Withdraw" onSubmit={onWithdrawEth} />
          </td>
        </tr>

        <tr>
          <td>GUIL</td>

          <td>{walletGuilBalance.unitaryAmount.toFixed(3)}</td>

          <td>{exchangeGuilBalance.unitaryAmount.toFixed(3)}</td>
        </tr>

        <tr>
          <td colSpan="3">
            <div className={styles.inputRow}>
              <TextInput type="text" />

              <Button>Withdraw</Button>
            </div>
          </td>
        </tr>
      </tbody>
    </Table>
  );
};

export const WithdrawPanel = connect(
  ({ web3, exchange, guilToken }) => ({ web3, exchange, guilToken }),
  _WithdrawPanel
);
