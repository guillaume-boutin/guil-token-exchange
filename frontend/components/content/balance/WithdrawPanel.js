import { Table } from "../../common/table";
import { OperationInput } from "./OperationInput";
import { connect } from "../../../context";
import BigNumber from "bignumber.js";

/**
 * @param props
 * @param {BigNumber} props.walletEthBalance
 * @param {BigNumber} props.exchangeEthBalance
 * @param {BigNumber} props.walletGuilBalance
 * @param {BigNumber} props.exchangeGuilBalance
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
  const formatAmount = (amount) => {
    if (amount >= 10000) return amount.toFixed(0);

    return amount.precision(4).toString();
  };

  const onWithdrawEth = async (value) => {
    const amount = web3.web3.utils.toWei(value, "ether");

    await exchange.contract.methods
      .withdrawEther(amount)
      .send({
        from: web3.account,
      })
      .on("transactionHash", (hash) => {
        exchange.setEthBalanceLoading(true);
      })
      .on("error", (error) => {
        console.error(error);
      });
  };

  const onWithdrawGuil = async (value) => {
    const amount = web3.web3.utils.toWei(value, "ether");

    exchange.contract.methods
      .withdraw({
        contractAddress: guilToken.contractAddress,
        amount,
      })
      .send({ from: web3.account })
      .on("transactionHash", (hash) => {
        exchange.setGuilBalanceLoading(true);
      })
      .on("error", (error) => {});
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

          <td>{formatAmount(walletEthBalance)}</td>

          <td>{formatAmount(exchangeEthBalance)}</td>
        </tr>

        <tr>
          <td colSpan="3">
            <OperationInput
              label="Withdraw"
              max={exchangeEthBalance}
              onSubmit={onWithdrawEth}
            />
          </td>
        </tr>

        <tr>
          <td>GUIL</td>

          <td>{formatAmount(walletGuilBalance)}</td>

          <td>{formatAmount(exchangeGuilBalance)}</td>
        </tr>

        <tr>
          <td colSpan="3">
            <OperationInput
              label="Withdraw"
              max={exchangeGuilBalance}
              onSubmit={onWithdrawGuil}
            />
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
