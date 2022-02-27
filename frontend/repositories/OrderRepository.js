import { Order } from "../entities/Order";

export class OrderRepository {
  /** @private */
  _contract;

  constructor(contract) {
    this._contract = contract;
  }

  async orders() {
    const response = await this._contract.getPastEvents("Order", {
      fromBlock: 0,
      toBlock: "latest",
    });
  }
}
