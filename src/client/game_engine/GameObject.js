import { Component } from './Component';
import { Scene } from './Scene';

export class GameObject {
  /**
   * Empty set of components
   * @type {Array<Component>}
   * @private
   */
  _components = null;

  /**
   * @public
   * @type {Scene}
   */
  scene = null;

  constructor() {
    this._components = [];
  }

  /**
   * @template T
   * @param {T} component 
   * @param {boolean} check
   * @returns {T}
   */
  addComponent(component, check=true) {
    if (check && component.prototype && this._components.some(v => v instanceof component.prototype)) {
      console.warn(`addComponent: the component is already in components list ${component}`);
      return null;
    }

    component.gameObject = this;
    this._components.push(component);
    return component;
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