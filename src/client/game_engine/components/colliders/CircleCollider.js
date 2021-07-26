import { getTransform } from "../../Utils";
import { Collider } from "../Collider";
import { CircleRendererInstance } from "../renderers";
import { TransformInstance } from "../Transform";

export class CircleCollider extends Collider {
  radius = 60;

  offset_x = 0;
  offset_y = 0;

  /**
   * @public
   * @type {boolean}
   */
  is_helper_visible = false;

  constructor() {
    super();
  }

  init() {
    let cRenderer = this.gameObject.getComponent(CircleRendererInstance);
    if (cRenderer !== null) {
      this.radius = cRenderer.radius;
    }

    let pos = (this.gameObject.getComponent(TransformInstance) || {x: 0, y: 0});
  }

  /**
   * Checks if point is in collider
   * @override
   * @param {number} x X coordinates
   * @param {number} y Y coordinates
   * @returns {boolean} true if point is in collider
   */
  hasPoint(x, y) {
    const [_x, _y] = getTransform(this.gameObject).matrix.slice(4, 6);
    return Math.pow(x-_x, 2) + Math.pow(y-_y, 2) <= this.radius * this.radius;
  }

  /**
   * @public
   * @method
   * @param {CanvasRenderingContext2D} ctx
   * @param {import('../../GameEngine').GlobalRenderSettings} renderSettings
   * @returns {void}
   */
  render(ctx, renderSettings) {
  if (!this.is_helper_visible) return;

  const tr = getTransform(this.gameObject);
  
  ctx.strokeStyle = '#00ff00';
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.closePath();
  }
}
