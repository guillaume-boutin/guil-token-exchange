import { Component } from "../../Component";
import { Table } from "../../common/table";
import { TextInput } from "../../common/form";
import { Button } from "../../common/button";
import BigNumber from "bignumber.js";
import style from "./NewOrder.module.scss";

export class OperationPanel extends Component {
  constructor(props) {
    super(props);
  }

  initialState(props) {
    return {
      amount: 0,
      price: props.currentPrice,
    };
  }

  boundMethods() {
    return [this.onAmountChange, this.onPriceChange, this.onSubmit];
  }

  get amountLabel() {
    return this.props.operation === "buy"
      ? "You get (GUIL)"
      : "You give (GUIL)";
  }

  get inReturnLabel() {
    return this.props.operation === "buy" ? "You pay (ETH)" : "You earn (ETH)";
  }

  /**
   * @return {BigNumber}
   */
  get inReturnAmount() {
    return new BigNumber(this.state.amount).times(
      new BigNumber(this.state.price)
    );
  }

  get disabled() {
    return (
      this.state.amount <= 0 ||
      this.state.price <= 0 ||
      this.exceedsMaxPayingAmount
    );
  }

  get exceedsMaxPayingAmount() {
    if (this.props.operation === "buy") {
      return this.inReturnAmount
        .shiftedBy(18)
        .isGreaterThan(this.props.maxPayingAmount);
    }

    return new BigNumber(this.state.amount)
      .shiftedBy(18)
      .isGreaterThan(this.props.maxPayingAmount);
  }

  onAmountChange(e) {
    this.setState({ amount: +e.target.value });
  }

  onPriceChange(e) {
    this.setState({ price: +e.target.value });
  }

  onSubmit() {
    this.props.onSubmit(this.state.amount, this.state.price);
  }

  render() {
    return (
      <Table>
        <tbody>
          <tr>
            <td>
              <label htmlFor="sell-token-amount-input">
                {this.amountLabel}
              </label>
            </td>
          </tr>

          <tr>
            <td>
              <TextInput
                type="number"
                value={this.state.amount}
                min="0"
                id="sell-token-amount-input"
                placeholder="Buy Amount"
                onChange={this.onAmountChange}
              />
            </td>
          </tr>

          <tr>
            <td>
              <label htmlFor="sell-token-price-input">Price (GUIL/ETH)</label>
            </td>
          </tr>

          <tr>
            <td>
              <TextInput
                type="number"
                value={this.state.price}
                min="0"
                id="sell-token-price-input"
                placeholder="Sell Price"
                onChange={this.onPriceChange}
              />
            </td>
          </tr>

          <tr>
            <td>{this.inReturnLabel}</td>
          </tr>

          <tr>
            <td>{this.inReturnAmount.toString()}</td>
          </tr>

          <tr>
            <td>
              <Button
                className={style.blockButton}
                onClick={this.onSubmit}
                disabled={this.disabled}
              >
                Place Order
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
    );
  }
}
