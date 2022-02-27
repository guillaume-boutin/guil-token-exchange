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

  /**
   * @private
   */
  _bindMethods() {
    this.boundMethods().forEach((method) => {
      this[method.name] = this[method.name].bind(this);
    });
  }

  /**
   * @private
   */
  _computeInitialState(props) {
    if (!this.initialState) return {};

    return this.initialState(props);
  }
}
