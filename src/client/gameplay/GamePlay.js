import * as GE from '../game_engine';
import { CircleRendererInstance } from '../game_engine/components/renderers';

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
  other_ball = null;

  /**
   * @private
   * @type {GE.GameObject}
   */
  main_ball = null;

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
    this.other_ball
      .getComponent(GE.Components.TransformInstance)
      .setPosition(-Constants.MAP_WIDTH / 2 + 70, Constants.MAP_HEIGHT / 2 - 70);

    this.main_ball
      .getComponent(GE.Components.TransformInstance)
      .setPosition(Constants.MAP_WIDTH / 2 - 70, -Constants.MAP_HEIGHT / 2 + 70);

    this.other_ball
      .getComponent(GE.Components.RENDERERS.CircleRendererInstance)
      .fill_color = 'red';
  }

  initScene() {
    // Creating map
    this.map = GE.Objects.createRect(Constants.MAP_WIDTH, Constants.MAP_HEIGHT);
    this.game_engine.scene.add(this.map);

    // Creating main object
    this.other_ball = GE.Objects.createCircle();
    this.game_engine.scene.add(this.other_ball);

    // Creating opponent object
    this.main_ball = GE.Objects.createCircle();
    this.game_engine.scene.add(this.main_ball);

    // Adding controls
    const cr = this.main_ball.addComponent(new GE.Components.COLLIDERS.CircleCollider());

    let mouse_offset = [0, 0];
    let touch = this.main_ball.addComponent(new GE.Components.Touch(cr))
      .setOnTouchStart((x, y) => {
        mouse_offset = GE.Math.Vector2.substractA(GE.Utils.getTransform(this.main_ball).getPosition(), [x, y]);
      }, true)
      .setOnTouchEnd((x, y) => {}, true)
      .setOnTouchMove(() => {}, true);

    const velocity = 0.7;
    let limitCoords = ([x, y]) => {
      const E_L = 7; // Extern Limitation

      const L_L = Constants.BALL_RADIUS - Constants.MAP_WIDTH / 2  + E_L; // Left Limitation
      const L_R = Constants.MAP_WIDTH / 2 - Constants.BALL_RADIUS  - E_L; // Right Limitation
      const L_D = Constants.BALL_RADIUS - Constants.MAP_HEIGHT / 2 + E_L; // Down Limitation
      const L_U = Constants.MAP_HEIGHT / 2 - Constants.BALL_RADIUS - E_L; // Up Limitation
      
      return [Math.min(Math.max(x, L_L), L_R), Math.min(Math.max(y, L_D), L_U)];
    }
    this.main_ball.update = (delta) => {
      const Renderer = this.main_ball.getComponent(CircleRendererInstance);
      if (touch.touched) {
        const Transform = GE.Utils.getTransform(this.main_ball);
        let cp = GE.Math.Vector2.sumA(mouse_offset, touch.current_position);
        let direction = GE.Math.Vector2.substractA(cp, Transform.getPosition());
        let distance = GE.Math.Vector2.calcDistance(direction);
        if (distance >= delta * velocity) {
          direction = GE.Math.Vector2.normalizeA(direction);
          Transform.setPosition(...limitCoords(GE.Math.Vector2.sumA(Transform.getPosition(), GE.Math.Vector2.multiplyA(direction, velocity * delta))));
          this.main_ball.getComponent(CircleRendererInstance).stroke_color = '#333333';
        } else {
          Transform.setPosition(...limitCoords(cp));
          Renderer.stroke_color = '#22ff22';
        }
      } else {
        Renderer.stroke_color = '#333333';
      }
    }
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