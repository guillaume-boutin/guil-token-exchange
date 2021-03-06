import {
  Order,
  HandledOrder,
  OrderFactory,
  HandledOrderFactory,
  Trade,
  TradeFactory,
} from "../entities";
import moment from "moment";
import { FilledOrderFactory } from "../entities/FilledOrder";

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

    return response.map(({ returnValues }) =>
      new OrderFactory().fromEventValues(returnValues)
    );
  }

  /**
   * @returns {Promise<Trade[]>}
   */
  async getTrades() {
    const response = await this._contract.getPastEvents("Trade", {
      fromBlock: 0,
      toBlock: "latest",
    });

    return response.map(({ returnValues }) =>
      new TradeFactory().fromEventValues(returnValues)
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
