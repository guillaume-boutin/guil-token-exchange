import { action, makeObservable } from "mobx";

export class EventsStore {
  /** @private {string[]} */ _eventIds = [];

  constructor() {
    makeObservable(this, {
      has: action,
      addEvent: action,
    });
  }

  has(event) {
    return this._eventIds.findIndex((id) => id === event.id) > -1;
  }

  addEvent(event) {
    if (this.has(event)) return;

    this._eventIds = [...this._eventIds, event.id];
  }
}
