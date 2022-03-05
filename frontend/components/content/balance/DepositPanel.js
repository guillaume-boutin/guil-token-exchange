import { Table } from "../../common/table";
import { Token } from "../../../entities";
import { OperationInput } from "./OperationInput";
import { connect } from "../../../context";
import web3 from "web3";

/**
 * @param props
 * @param {string} props.account
 * @param props.exchangeContract
 * @param props.guilTokenContract
 * @param props.setExchangeEthBalanceLoading
 * @param props.setWalletGuilBalanceLoading
 * @param {Token} props.walletEthBalance
 * @param {Token} props.exchangeEthBalance
 * @param {Token} props.walletGuilBalance
 * @param {Token} props.exchangeGuilBalance
 */
export const DepositPanel = ({
  account,
  exchangeContract,
  guilTokenContract,
  setExchangeEthBalanceLoading,
  setWalletGuilBalanceLoading,
  walletEthBalance,
  exchangeEthBalance,
  walletGuilBalance,
  exchangeGuilBalance,
}) => {
  const onDepositEth = async (amount) => {
    await exchangeContract.methods
      .depositEther()
      .send({
        from: account,
        value: web3.utils.toWei(amount, "ether"),
      })
      .on("transactionHash", (hash) => {
        setExchangeEthBalanceLoading(true);
      });
  };

  const onDepositGuil = (amount) => {
    setWalletGuilBalanceLoading(true);

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
