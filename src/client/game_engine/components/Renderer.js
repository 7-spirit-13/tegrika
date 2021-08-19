import { Component } from '../Component';
import { TransformInstance } from './Transform';



/**
 * @typedef {function(ctx: CanvasRenderingContext2D)} render
*/

/**
 * @class
 */
export class Renderer extends Component {

  /**
   * Returns width and height of the object
   * @returns {Array<number>}
   */
  getBoundingRect() {

  }

  update() {
    
  }

  /**
   * @public
   * @method
   * @param {CanvasRenderingContext2D} ctx
   * @param {import('../GameEngine').GlobalRenderSettings} renderSettings
   */
  render(ctx, renderSettings) {
    const { width: w, height: h } = ctx.canvas;
    const mx = ((this.gameObject.getComponent(TransformInstance)).matrix || [1, 0, 0, 1, 0, 0]).map(v => v * renderSettings.zoom);
    ctx.setTransform(...[mx[0], mx[1], mx[2], mx[3], mx[4] + w / 2, -mx[5] + h / 2]);
    return null;
  }
}

export const RendererInstance = new Renderer();