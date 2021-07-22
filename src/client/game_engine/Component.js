import { GameObject } from "./GameObject";

let c_key = 0;

export function registerComponent() {
  return c_key++;
}

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