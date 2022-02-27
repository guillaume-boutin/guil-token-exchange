export class Token {
  get address() {
    return this._address;
  }

  set address(value) {
    this._address = value;
  }

  get amount() {
    return this._amount;
  }

  set amount(value) {
    this._amount = value;
  }

  constructor({ address, amount }) {
    this._address = address;
    this._amount = amount;
  }
}
