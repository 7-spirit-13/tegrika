import { Component, registerComponent } from "../Component";

export class Transform extends Component {
  static rIndex = registerComponent();

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
    if (x != null) matrix[2] = x;
    if (y != null) matrix[5] = y;
  }
}

export const TransformInstance = new Transform();