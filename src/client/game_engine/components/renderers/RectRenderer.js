import { Renderer } from "../Renderer";

/** 
 * @class
 * @extends Renderer
 */
export class RectRenderer extends Renderer {
  width = 60;
  height = 60;
  stroke_width = 2;
  fill_color = '#f5f5f5';
  stroke_color = '#444444';

  /**
   * @public
   * @method
   * @param {CanvasRenderingContext2D} ctx
   * @param {import('../../GameEngine').GlobalRenderSettings} renderSettings
   * @returns {void}
   */
  render(ctx, renderSettings) {
    // Transforming
    super.render(...arguments);
    
    // Settings properties
    ctx.fillStyle = this.fill_color;
    ctx.lineWidth = this.stroke_width;
    ctx.strokeStyle = this.stroke_color;
    
    // Begin Path
    ctx.beginPath();

    // Draw circle
    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.stroke();
    ctx.fill();

    // Close path
    ctx.closePath();
  }
}

export const RectRendererInstance = new RectRenderer();