import { Component, registerComponent } from '../Component';
import { TransformInstance } from './Transform';

export class Renderer extends Component {
  static rIndex = registerComponent();

  /**
   * @type {Number}
   */
  static zoom = 1.;

  /**
   * Returns width and height of the object
   * @returns {Array<number>}
   */
  getBoundingRect() {

  }

  update() {
    
  }

  /**
   * @param {CanvasRenderingContext2D} context
   * @returns {void}
  */
  render(context) {
    const { width: w, height: h } = context.canvas;
    const mx = (this.gameObject.getComponent(TransformInstance)).matrix || [1, 0, 0, 1, 0, 0];
    context.setTransform(mx[0], mx[1], mx[2], mx[3] * -1, mx[4] + w / 2, mx[5] + h / 2);
  }
}

export const RendererInstance = new Renderer();