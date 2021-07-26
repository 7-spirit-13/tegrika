import { Component } from "../Component";

export class Transform extends Component {

  /**
   * @description Projection matrix
   * @type {Float32Array}
   * -----------------
   * 
   * Scheme:
   * ( x(x) y(x) )
   * ( x(y) y(y) )
   * ( c_x  c_y  )
   * ---------------
   * 
   * Default:
   * ( 1 0 )
   * ( 0 1 )
   * ( 0 0 )
   * ---------------
   * 
   */
  matrix = null;

  /**
   * @description Rotation in radians
   * @type {Number}
   */
  rotation = 0;

  constructor() {
    super();
    this.matrix = new Float32Array(6);
    this.matrix[0] = this.matrix[3] = 1;
  }

  /**
   * @param {Number} x
   * @param {Number} y
   */
  setPosition(x, y) {
    if (x != null) this.matrix[4] = x;
    if (y != null) this.matrix[5] = y;
  }

  /**
   * @returns {Array<number>}
   */
  getPosition() {
    return this.matrix.slice(4, 6);
  }
}

export const TransformInstance = new Transform();