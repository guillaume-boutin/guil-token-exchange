export class Order {
  /**
   * @param {Object} props
   * @param {Number} props.tokenAmount
   * @param {Number} props.ethAmount
   * @param {Number} props.price
   */
  constructor({ tokenAmount, ethAmount, price }) {
    this._tokenAmount = tokenAmount;
    this._ethAmount = ethAmount;
    this._price = price;
  }

  get tokenAmount() {
    return this._tokenAmount;
  }

  set tokenAmount(value) {
    this._tokenAmount = value;
  }

  get ethAmount() {
    return this._ethAmount;
  }

  set ethAmount(value) {
    this._ethAmount = value;
  }

  get price() {
    return this._price;
  }

  set price(value) {
    this._price = value;
  }
}
