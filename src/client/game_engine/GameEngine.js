import { Scene } from './ObjectManager';

export class GameEngine {
  /** If true, not rendering */
  paused = false;

  frame_duration = 1000. / 15.;

  // Last render time
  last_render_time = 0;

  /** @type {HTMLCanvasElement} */
  canvas = null;

  /** @type {ObjectManager} */
  objects = null;

  constructor(_canvas=null) {
    this.canvas = _canvas;
    this.scene = new Scene();
  }

  /**
   * @public
   * @param {HTMLCanvasElement} newCanvas
   */
  setCanvas = (newCanvas) => {
    this.canvas = newCanvas;
    this.canvas.getContext('2d');
  }

  /**
   * Updates the objects
   * @private
   */
  update() {
    this.scene.objects.forEach(v => v._components.forEach(v => v.update()));
  }

  /**
   * Drawing the objects
   * @private
   */
  render() {
    this.scene.objects.forEach(v => v._components.forEach(v => v.render()));
  }

  /**
   * Updates and renders objects
   * @private
   */
  cycle() {
    if (this.paused) return;

    this.last_render_time = Date.now();

    this.render();
    this.update();

    let now = Date.now();
    let dif = now - this.last_render_time;
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