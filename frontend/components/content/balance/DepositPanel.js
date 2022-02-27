import styles from "./DepositPanel.module.scss";
import { Table } from "../../common/table/Table";
import { TextInput } from "../../common/form/TextInput";
import { Button } from "../../common/button/Button";

export const DepositPanel = () => (
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

          <td>0</td>

          <td>0</td>
        </tr>

        <tr>
          <td colSpan="3">
            <div className={styles.inputRow}>
              <TextInput type="text" />

              <Button>Deposit</Button>
            </div>
          </td>
        </tr>

        <tr>
          <td>GUIL</td>

          <td>0</td>

          <td>0</td>
        </tr>

        <tr>
          <td colSpan="3">
            <div className={styles.inputRow}>
              <TextInput type="text" />

              <Button>Deposit</Button>
            </div>
          </td>
        </tr>
      </tbody>
    </Table>
  </>
);
