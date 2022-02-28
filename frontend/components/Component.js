import React, { Component as BaseComponent } from "react";

export class Component extends BaseComponent {
  constructor(props) {
    super(props);

    this.state = this._computeInitialState(props);
    this._bindMethods();
  }

  boundMethods() {
    return [];
  }

  initialState(props) {
    return {};
  }

  /**
   * @private
   */
  _bindMethods() {
    this.boundMethods().forEach((method) => {
      if (!this[method.name]) {
        console.error(`No method "${this[method.name]}" to be bound.`);
      } else {
        this[method.name] = this[method.name].bind(this);
      }
    });
  }

  /**
   * @private
   */
  _computeInitialState(props) {
    return this.initialState(props);
  }
}
