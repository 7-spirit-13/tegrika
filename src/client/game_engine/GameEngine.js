import { Scene } from './Scene';

/**
 * @typedef {object} GlobalRenderSettings
 * @property {number} zoom
 */

export class GameEngine {
  /** If true, not rendering */
  paused = false;

  frame_duration = 1000. / 60.;

  /**
   * @type {number}
   */
  _last_render_time = 0;

  /**
   * @type {number}
   */
  _last_update_time = 0;

  /** @type {HTMLCanvasElement} */
  canvas = null;

  /** @type {Scene} */
  scene = null;
  
  /**
   * @type {GlobalRenderSettings}
   */
  render_settings = null;

  constructor(_canvas=null) {
    this._last_update_time = Date.now();
    this.canvas = _canvas;
    this.scene = new Scene();
    this.scene.game_engine = this;

    this.render_settings = new Object();
    this.render_settings.zoom = 0;
  }

  /**
   * @public
   * @param {HTMLCanvasElement} newCanvas
   */
  setCanvas = (newCanvas) => {
    this.canvas = newCanvas;
  }

  /**
   * Updates the objects
   * @private
   */
  update(delta) {
    this.scene.objects.forEach(obj => {
      if (obj.update) obj.update(delta);
      obj._components.forEach(c => c.update(delta))
    });
  }

  /**
   * Drawing the objects
   * @private
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
    ctx.resetTransform();
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.scene.objects.forEach(obj => {
      if (obj.render) obj.render(ctx, this.render_settings);
      obj._components.forEach(c => c.render(ctx, this.render_settings))
    });
  }

  /**
   * Updates and renders objects
   * @private
   */
  cycle() {
    if (this.paused) return;

    this._last_render_time = Date.now();
    this.render(this.canvas.getContext('2d'));
    
    this.update(Date.now() - this.last_update_time);
    this.last_update_time = Date.now();

    let now = Date.now();
    let dif = now - this._last_render_time;
    if (dif < this.frame_duration) {
      setTimeout(this.cycle.bind(this), this.frame_duration - dif);
    } else {
      requestAnimationFrame(this.cycle.bind(this));
    }
  }

  /**
   * Starts game cycle
   * @public
   */
  start() {
    this.paused = false;
    requestAnimationFrame(this.cycle.bind(this));
  }

  /**
   * Stop game cycle
   * @public
   */
  pause() {
    this.paused = true;
  }
}