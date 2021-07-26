import { GameObject } from "./GameObject";

export class Component {
  /**
   * @type {GameObject}
   */
  gameObject = null;

  /**
   * @param {GameObject} gameObject
   */
  constructor(gameObject) {
    this.gameObject = gameObject;
  }

  // Calculating process
  update(){};

  // Rendering process
  render(){};
}