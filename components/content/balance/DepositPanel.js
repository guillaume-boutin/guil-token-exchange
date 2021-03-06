import { Table } from "../../common/table";
import { OperationInput } from "./OperationInput";
import { Context } from "../../../context";
import { useContext } from "react";
import { observer } from "mobx-react-lite";

/**
 * @param props
 * @param {BigNumber} props.walletEthBalance
 * @param {BigNumber} props.exchangeEthBalance
 * @param {BigNumber} props.walletGuilBalance
 * @param {BigNumber} props.exchangeGuilBalance
 */
const _DepositPanel = ({
  walletEthBalance,
  exchangeEthBalance,
  walletGuilBalance,
  exchangeGuilBalance,
}) => {
  const {
    web3Store: {
      sdk,
      account,
      exchangeContract,
      exchangeContractAddress,
      guilTokenContract,
      guilTokenContractAddress,
    },
  } = useContext(Context);

  const formatAmount = (amount) => {
    amount = amount.shiftedBy(-18);
    if (amount >= 10000) return amount.toFixed(0);

    return amount.precision(4).toString();
  };

  const onDepositEth = async (value) => {
    const amount = sdk.utils.toWei(value.toString(), "ether");

    await exchangeContract.methods
      .depositEther()
      .send({
        from: account,
        value: amount,
      })
      .on("transactionHash", (hash) => {});
  };

  const onDepositGuil = async (value) => {
    const amount = sdk.utils.toWei(value.toString(), "ether");

    guilTokenContract.methods
      .approve(exchangeContractAddress, amount)
      .send({ from: account })
      .on("transactionHash", (hash) => {
        const contractAddress = guilTokenContractAddress;

        exchangeContract.methods
          .deposit({ contractAddress, amount })
          .send({ from: account })
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
                max={walletEthBalance.shiftedBy(-18)}
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
                max={walletGuilBalance.shiftedBy(-18)}
                onSubmit={onDepositGuil}
              />
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};

export const DepositPanel = observer(_DepositPanel);
