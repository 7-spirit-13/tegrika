import { Renderer } from "../Renderer";

/** 
 * @class
 * @extends Renderer
 */
export class CircleRenderer extends Renderer {
  radius = 60;
  stroke_width = 6;
  fill_color = '#555555';
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
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();

    // Close path
    ctx.closePath();
  }
}

export const CircleRendererInstance = new CircleRenderer();