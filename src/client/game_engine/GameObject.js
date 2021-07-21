import { Component } from './Component';

export class GameObject {
  /**
   * Empty set of components
   * @type {Array<Component>}
   */
  components = null;
  
  constructor() {
    this.components = null;

    // User's code
    this.init();
  }

  addComponent() {

  }

  /**
   * @public
   * Init function
   */
  init() {
    
  }

  /**
   * @public
   * Update state of the object
   */
  update() {

  }

  /**
   * @public
   * Render the object on the canvas
   */
  render() {

  }
}