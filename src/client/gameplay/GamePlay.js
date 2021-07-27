import { isIphone } from '../core/Utils';
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
   * @type {boolean}
   */
   _is_iphone = false;

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
   * @param {boolean} retina_ready training mode
   */
  constructor(training=false, retina_ready=false) {
    this.game_engine = new GE.GameEngine;
    this.retina_ready = retina_ready;

    if (retina_ready) {
      this._is_iphone = isIphone();
    }
  }

  reset() {
    this.other_ball
      .getComponent(GE.Components.TransformInstance)
      .setPosition(-Constants.MAP_WIDTH / 2 + 70, Constants.MAP_HEIGHT / 2 - 70);

    this.main_ball
      .getComponent(GE.Components.TransformInstance)
      .setPosition(Constants.MAP_WIDTH / 2 - 70, -Constants.MAP_HEIGHT / 2 + 70);

    this.other_ball
      .getComponent(GE.Components.Renderers.CircleRendererInstance)
      .fill_color = 'red';
  }

  updateSize() {
    const {width: w, height: h} = this.canvas.getBoundingClientRect();
    this.game_engine.render_settings.zoom = (1 + this._is_iphone) * Math.min((w - 20) / Constants.MAP_WIDTH, (h - 30) / Constants.MAP_HEIGHT);
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

    this.main_ball.getComponent(GE.Components.Renderers.CircleRendererInstance)
      .radius = Constants.BALL_RADIUS;

    
    this.other_ball.getComponent(GE.Components.Renderers.CircleRendererInstance)
      .radius = Constants.BALL_RADIUS;
  }

  controls() {
    // Adding controls
    const cr = this.main_ball.addComponent(new GE.Components.Colliders.CircleCollider());

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

      const L_L = -Constants.MAP_WIDTH  / 2 + Constants.BALL_RADIUS + E_L; // Left Limitation
      const L_R =  Constants.MAP_WIDTH  / 2 - Constants.BALL_RADIUS - E_L; // Right Limitation
      const L_D = -Constants.MAP_HEIGHT / 2 + Constants.BALL_RADIUS + E_L; // Down Limitation
      const L_U =  Constants.MAP_HEIGHT / 2 - Constants.BALL_RADIUS - E_L; // Up Limitation
      
      return [Math.min(Math.max(x, L_L), L_R), Math.min(Math.max(y, L_D), L_U)];
    }
    this.main_ball.update = (delta) => {
      const Renderer = this.main_ball.getComponent(CircleRendererInstance);
      
      if (touch.touched) {
        const Vec2 = GE.Math.Vector2;
        const Transform = GE.Utils.getTransform(this.main_ball);
        
        let cp = Vec2.sumA(mouse_offset, touch.current_position);
        let direction = Vec2.substractA(cp, Transform.getPosition());
        let distance = Vec2.calcDistance(direction);

        if (distance >= delta * velocity) {
          direction = Vec2.normalizeA(direction);
          Transform.setPosition(...limitCoords(Vec2.sumA(Transform.getPosition(), Vec2.multiplyA(direction, velocity * delta))));
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

    this.updateSize();
    this.initScene();
    this.controls();
    this.reset();

    window.addEventListener('resize', this.updateSize.bind(this));
  }
}