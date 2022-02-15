import styled from "styled-components";
import { Table } from "../../common/table/table";
import { TextInput } from "../../common/form/text-input";
import { Button } from "../../common/button/button";

const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
`;

export const WithdrawPanel = () => (
  <>
    <Table>
      <thead>
        <tr>
          <td>Token</td>

          <td>Wallet</td>

          <td>Exchange</td>
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
            <InputWrapper>
              <TextInput type="text" />

              <Button>Withdraw</Button>
            </InputWrapper>
          </td>
        </tr>

        <tr>
          <td>GUIL</td>

          <td>0</td>

          <td>0</td>
        </tr>

        <tr>
          <td colSpan="3">
            <InputWrapper>
              <TextInput type="text" />

              <Button>Withdraw</Button>
            </InputWrapper>
          </td>
        </tr>
      </tbody>
    </Table>
  </>
);
