import { Component } from "../Component";

export class Transform extends Component {
  /**
   * @description Projection matrix
   * @type {Float32Array}
   * -----------------
   * 
   * Scheme:
   * ( x(x) y(x) 0 )
   * ( x(y) y(y) 0 )
   * ( c_x  c_y  1 )
   * ---------------
   * 
   * Default:
   * ( 1 0 0 )
   * ( 0 1 0 )
   * ( 0 0 1 )
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
    this.matrix = new Float32Array(9);
    this.matrix[0] = this.matrix[4] = this.matrix[8] = 1;
  }
}