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

  /** @private @type boolean */
  isInverse = false;

  /** @public @type {number} */
  touching_time = 0;

  /** @public @type {boolean} */
  have_touched = false;

  /** @public @type {function(Array<number>)} */
  on_update_coords = null;

  /** @public @type {function(number)} */
  on_update_touching_time = null;

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

  init(role) {
    this.isInverse = role == 'overtake';
  }

  reset() {
    // Начальные позиции
    this.other_ball
      .getComponent(GE.Components.TransformInstance)
      .setPosition(-Constants.MAP_WIDTH / 2 + 70, Constants.MAP_HEIGHT / 2 - 70);

    this.main_ball
      .getComponent(GE.Components.TransformInstance)
      .setPosition(Constants.MAP_WIDTH / 2 - 70, -Constants.MAP_HEIGHT / 2 + 70);

    // Установка цветов для каждого круга
    const fill_colors = ["#2196f3", "red"];
    if (this.isInverse) {
      fill_colors.push(fill_colors.splice(0, 1)[0]);
    }

    [this.main_ball, this.other_ball].forEach((v, i) => {
      v.getComponent(GE.Components.Renderers.CircleRendererInstance).fill_color = fill_colors[i];
    });
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

      const L_L = -Constants.MAP_WIDTH  / 2 + Constants.BALL_RADIUS + E_L; // Left  Limitation
      const L_R =  Constants.MAP_WIDTH  / 2 - Constants.BALL_RADIUS - E_L; // Right Limitation
      const L_D = -Constants.MAP_HEIGHT / 2 + Constants.BALL_RADIUS + E_L; // Down  Limitation
      const L_U =  Constants.MAP_HEIGHT / 2 - Constants.BALL_RADIUS - E_L; // Up    Limitation
      
      return [Math.min(Math.max(x, L_L), L_R), Math.min(Math.max(y, L_D), L_U)];
    }

    let last_touching_time = Date.now();
    this.main_ball.update = (delta) => {
      const Renderer = this.main_ball.getComponent(CircleRendererInstance);
      const Transform = GE.Utils.getTransform(this.main_ball);

      if (touch.touched) {
        const Vec2 = GE.Math.Vector2;
        
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

        if (this.on_update_coords !== null) {
          this.on_update_coords(GE.Math.Vector2.multiplyA(Transform.getPosition(), this.isInverse ? -1 : 1));
        }
      } else {
        Renderer.stroke_color = '#333333';

      }

      const pA = Transform.getPosition();
      const pB = GE.Utils.getTransform(this.other_ball).getPosition();
      if ((pA[0] - pB[0]) * (pA[0] - pB[0]) + (pA[1] - pB[1]) * (pA[1] - pB[1]) < Math.pow(Constants.BALL_RADIUS * 2, 2)) {
        const now = Date.now();
        if (this.have_touched) {
          this.touching_time += now - last_touching_time;
          this.on_update_touching_time(this.touching_time);
        } else {
          this.have_touched = true;
        }

        last_touching_time = now;
      } else {
        this.have_touched = false;
      }
    }
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {void}
   */
  updateOpponentPosition([_x, _y]) {
    let x = _x, y = _y;
    
    if (this.isInverse) {
      x = -x;
      y = -y;
    }
    
    GE.Utils.getTransform(this.other_ball).setPosition(x, y);
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