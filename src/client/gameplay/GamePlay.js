import * as GE from '../game_engine';

import * as Constants from './constants';

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
   * @type {GE.GameObject}
   */
   map = null;

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
  }

  reset() {
    this.my_ball
      .getComponent(GE.COMPONENTS.TransformInstance)
      .setPosition(-Constants.MAP_WIDTH / 2 + 70, Constants.MAP_HEIGHT / 2 - 70);

    this.other_ball
      .getComponent(GE.COMPONENTS.TransformInstance)
      .setPosition(Constants.MAP_WIDTH / 2 - 70, -Constants.MAP_HEIGHT / 2 + 70);

    this.my_ball
      .getComponent(GE.COMPONENTS.RENDERERS.CircleRendererInstance)
      .fill_color = 'red';

    this.my_ball
      .getComponent(GE.COMPONENTS.TransformInstance)
      .setPosition(-100, 100);
  }

  initScene() {
    // Creating map
    this.map = GE.OBJECTS.createRect(Constants.MAP_WIDTH, Constants.MAP_HEIGHT);
    this.game_engine.scene.add(this.map);

    // Creating opponent object
    this.other_ball = GE.OBJECTS.createCircle();
    this.game_engine.scene.add(this.other_ball);

    // Creating main object
    this.my_ball = GE.OBJECTS.createCircle();
    this.game_engine.scene.add(this.my_ball);

    // Adding controls
    this.my_ball.addComponent(new GE.COMPONENTS.Touch()).setOnTouchStart((ev) => {
      console.log(ev);
    });
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

    // Antialiasing
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;

    this.initScene();
    this.reset();
  }
}