import { Component, registerComponent } from './Component';

export class GameObject {
  // @ts-check
  /**
   * Empty set of components
   * @type {Array<Component>}
   * @private
   */
  _components = null;
  
  constructor() {
    this._components = [];
  }

  /**
   * @param {Component} component 
   * @param {boolean} check 
   */
  addComponent(component, check=true) {
    if (check && component.prototype && this._components.some(v => v instanceof component.prototype)) {
      console.warn(`addComponent: the component is already in components list ${component}`);
      return false;
    }
    component.gameObject = this;
    this._components.push(component);
    return true;
  }

  /** 
   * @template T
   * @param {T} instance
   * @returns {T}
   */
  getComponent(instance) {
    return this._components.find(c => c.constructor === instance.constructor);
  }

  removeComponent(component) {
    let index = this._components.indexOf(component);
    
    if (index === -1)
      return false;

    this._components.splice(index, 1);
    
    return true;
  }
}