import { Renderer } from "../Renderer";

export class CircleRenderer extends Renderer {
  radius = 60;
  stroke_width = 2;
  fill_color = '#eeeeee';
  stroke_color = '#444444';

  /**
   * @override
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
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