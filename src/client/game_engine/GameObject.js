import Component from './Component';

export default class GameObject {
  constructor() {
    this.init();
  }

  /** @type {Set<Component>} */
  components = null;

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