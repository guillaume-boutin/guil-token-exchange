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
const _DepositPanel = ({
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

  const onDepositEth = async (value) => {
    const amount = web3.web3.utils.toWei(value, "ether");

    await exchange.contract.methods
      .depositEther()
      .send({
        from: web3.account,
        value: amount,
      })
      .on("transactionHash", (hash) => {
        exchange.setEthBalanceLoading(true);
      });
  };

  const onDepositGuil = async (value) => {
    const amount = web3.web3.utils.toWei(value, "ether");

    guilToken.contract.methods
      .approve(exchange.contractAddress, amount)
      .send({ from: web3.account })
      .on("transactionHash", (hash) => {
        exchange.setGuilBalanceLoading(true);

        const contractAddress = guilToken.contractAddress;

        exchange.contract.methods
          .deposit({ contractAddress, amount })
          .send({ from: web3.account })
          .on("transactionHash", (hash) => {})
          .on("error", (error) => {
            console.error(error);
          });
      })
      .on("error", (error) => {
        console.error(error);
      });
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

            <td>{formatAmount(walletEthBalance)}</td>

            <td>{formatAmount(exchangeEthBalance)}</td>
          </tr>

          <tr>
            <td colSpan="3">
              <OperationInput
                label="Deposit"
                max={walletEthBalance}
                onSubmit={onDepositEth}
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
                label="Deposit"
                max={walletGuilBalance}
                onSubmit={onDepositGuil}
              />
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
