import * as GE from '../game_engine';

/**
 * Abstract layer over engine
 */
export class GamePlay {
  /**
   * @private
   * @type {HTMLCanvasElement}
   */
  canvas = null;

  /**
   * @private
   * @type {GE.GameObject}
   */
  my_ball = null;

  /**
   * @private
   * @type {GE.GameObject}
   */
  other_ball = null;

  /**
   * @private
   * @type {GE.GameEngine}
   */
  game_engine = null;

  /**
   * @param {boolean} training training mode
   */
  constructor(training=false) {
    this.game_engine = new GE.GameEngine;
    this.reset();
  }

  reset() {
    this.other_ball = GE.OBJECTS.createCircle();
    this.game_engine.scene.add(this.other_ball);

    this.my_ball = GE.OBJECTS.createCircle();
    this.game_engine.scene.add(this.my_ball);
    
    this.my_ball.getComponent(GE.COMPONENTS.TransformInstance).setPosition(-100, 100);
    const renderer = this.my_ball.getComponent(GE.COMPONENTS.RENDERERS.CircleRendererInstance);
    renderer.fill_color = 'red';
  }

  start() {
    this.game_engine.start();
  }

  /**
   * 
   * @param {HTMLCanvasElement} canvas 
   */
  setCanvas(canvas) {
    this.game_engine.setCanvas(canvas);
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
  }
}