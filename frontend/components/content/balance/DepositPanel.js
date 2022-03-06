import { Table } from "../../common/table";
import { Token } from "../../../entities";
import { OperationInput } from "./OperationInput";
import { connect } from "../../../context";

/**
 * @param props
 * @param {Token} props.walletEthBalance
 * @param {Token} props.exchangeEthBalance
 * @param {Token} props.walletGuilBalance
 * @param {Token} props.exchangeGuilBalance
 */
const _DepositPanel = ({
  web3,
  exchange,
  guilToken,
  walletEthBalance,
  exchangeEthBalance,
  walletGuilBalance,
  exchangeGuilBalance,
}) => {
  const onDepositEth = async (amount) => {
    await exchange.contract.methods
      .depositEther()
      .send({
        from: web3.account,
        value: web3.utils.toWei(amount, "ether"),
      })
      .on("transactionHash", (hash) => {
        exchange.setEthBalanceLoading(true);
      });
  };

  const onDepositGuil = (amount) => {
    guilToken.setBalanceLoading(true);

    // await guilTokenContract.methods.
  };

  return (
    <>
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
              <OperationInput label="Deposit" onSubmit={onDepositEth} />
            </td>
          </tr>

          <tr>
            <td>GUIL</td>

            <td>{walletGuilBalance.unitaryAmount.toFixed(3)}</td>

            <td>{exchangeGuilBalance.unitaryAmount.toFixed(3)}</td>
          </tr>

          <tr>
            <td colSpan="3">
              <OperationInput label="Deposit" onSubmit={onDepositGuil} />
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};

export const DepositPanel = connect(
  ({ web3, exchange, guilToken }) => ({ web3, exchange, guilToken }),
  _DepositPanel
);
