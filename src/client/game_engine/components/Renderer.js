import { Component, registerComponent } from '../Component';

export class Renderer extends Component {
  static rIndex = registerComponent();

  /**
   * Returns width and height of the object
   * @returns {Array<number>}
   */
  getBoundingRect() {

  }

  /**
   * @param {CanvasRenderingContext2D} context
   * @returns {void}
  */
  render(context) {
    
  }
}