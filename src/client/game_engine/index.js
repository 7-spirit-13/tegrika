import ObjectManager from './ObjectManager';

/**
 * @constructor
 * @param {HTMLCanvasElement | null} _canvas
 */
export class GameEngine {
  /** If true, not rendering */
  paused = false;

  frameDuration = 1000. / 15.;

  // Last render time
  lastRenderTime = 0;

  /** @type {HTMLCanvasElement} */
  canvas = null;

  /** @type {ObjectManager} */
  objects = null;

  constructor(_canvas=null) {
    this.canvas = _canvas;
    this.objects = new ObjectManager();
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
    this.objects.entities.forEach(v => v.update());
  }

  /**
   * Drawing the objects
   * @private
   */
  render() {
    this.objects.entities.forEach(v => v.render());
  }

  /**
   * Updates and renders objects
   * @private
   */
  cycle() {
    if (this.paused) return;

    this.lastRenderTime = Date.now();

    this.render();
    this.update();

    let now = Date.now();
    let dif = now - this.lastRenderTime;
    if (dif < this.frameDuration) {
      setTimeout(this.cycle.bind(this), this.frameDuration - dif);
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