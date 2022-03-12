import { Order, OrderFactory } from "./Order";
import { Token } from "./Token";
import BigNumber from "bignumber.js";
import moment from "moment";

export class Trade {
  /**
   * @param props;
   * @param {number} props.id
   * @param {string} props.user
   * @param {Order} props.order
   * @param {number} props.timestamp
   */
  constructor({ id, user, order, timestamp }) {
    this._id = id;
    this._user = user;
    this._order = order;
    this._timestamp = timestamp;
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get user() {
    return this._user;
  }

  set user(value) {
    this._user = value;
  }

  /**
   * @return {string}
   */
  get taker() {
    return this.user;
  }

  /**
   * @return {string}
   */
  get placer() {
    return this.order.user;
  }

  /**
   * @return {Order}
   */
  get order() {
    return this._order;
  }

  /**
   * @param {Order} value
   */
  set order(value) {
    this._order = value;
  }

  /**
   * @return {moment.Moment}
   */
  get timestamp() {
    return moment.unix(this._timestamp);
  }

  /**
   * @return {Token}
   */
  get ether() {
    return this.order.ether;
  }

  /**
   * @return {Token}
   */
  get token() {
    return this.order.token;
  }

  /**
   * @param {string} user
   * @return {boolean}
   */
  isTaker(user) {
    return this.user === user;
  }

  /**
   * @param {string} user
   * @return {boolean}
   */
  isPlacer(user) {
    return this.order.user === user;
  }

  /**
   * @param {string} user
   * @return {boolean}
   */
  isActor(user) {
    return this.isPlacer(user) || this.isTaker(user);
  }

  /**
   * @param {string} user
   * @return {Token}
   */
  getEarning(user) {
    if (user === this.taker) {
      return this.order.offer;
    }
    if (user === this.placer) {
      return this.order.demand;
    }

    return Token.null();
  }

  getNetEarning(user, feeRate) {
    const earning = this.getEarning(user);
    if (earning.isNull) return earning;

    const fee = this.getFee(user, feeRate);

    return earning.minus(fee);
  }

  /**
   * @param {string} user
   * @return {Token}
   */
  getPaying(user) {
    if (user === this.taker) {
      return this.order.demand;
    }
    if (user === this.placer) {
      return this.order.offer;
    }

    return Token.null();
  }

  /**
   * @param {string} user,
   * @param {BigNumber} rate
   * @return {Token}
   */
  getFee(user, rate) {
    const earning = this.getEarning(user);

    if (this.isTaker(user)) {
      return this.getEarning(user).times(rate);
    }

    return new Token({ address: earning.address, amount: new BigNumber(0) });
  }
}

export class TradeFactory {
  fromEventValues({ id, order, user, timestamp }) {
    return new Trade({
      id,
      order: new OrderFactory().fromEventValues(order),
      user,
      timestamp,
    });
  }
}
