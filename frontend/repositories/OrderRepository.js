import {
  Order,
  HandledOrder,
  OrderFactory,
  HandledOrderFactory,
} from "../entities";
import moment from "moment";

export class OrderRepository {
  /** @private */
  _contract;

  constructor(contract) {
    this._contract = contract;
  }

  /**
   * @returns {Promise<Order[]>}
   */
  async getOrders() {
    const response = await this._contract.getPastEvents("Order", {
      fromBlock: 0,
      toBlock: "latest",
    });

    console.log(response);

    return response.map(({ returnValues }) =>
      new OrderFactory().fromEventValues(returnValues)
    );
  }

  /**
   * @returns {Promise<HandledOrder[]>}
   */
  async getFilledOrders() {
    const response = await this._contract.getPastEvents("Trade", {
      fromBlock: 0,
      toBlock: "latest",
    });

    return response.map(({ returnValues }) =>
      new HandledOrderFactory().fromEventValues(returnValues)
    );
  }

  /**
   * @returns {Promise<HandledOrder[]>}
   */
  async getCancelledOrders() {
    const response = await this._contract.getPastEvents("Cancel", {
      fromBlock: 0,
      toBlock: "latest",
    });

    return response.map(({ returnValues }) =>
      new HandledOrderFactory().fromEventValues(returnValues)
    );
  }
}
