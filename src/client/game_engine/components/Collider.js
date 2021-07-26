import { Component } from '../Component';

export class Collider extends Component {
  /**
   * Checks if point is in collider
   * @param {number} x X coordinates
   * @param {number} y Y coordinates
   * @returns {boolean} true if point is in collider
   */
  hasPoint(x, y) {}
}

export const ColliderInstance = new Collider();