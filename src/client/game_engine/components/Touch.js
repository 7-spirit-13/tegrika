import { Component } from "../Component";
import { Vector2 } from "../math";
import { convertCanvas2Context } from "../Utils";
import { Collider } from "./Collider";

export class Touch extends Component {
  /** @private @type {function} */
  _touch_start_clb = null;

  /** @private @type {function} */
  _touch_end_clb = null;

  /** @private @type {function} */
  _touch_move_clb = null;

  /** @public @readonly @type {boolean} */
  touched = false;

  /** @public @readonly @type {Array<number>} */
  start_position = null;

  /** @public @readonly @type {Array<number>} */
  current_position = null;

  /** @public @type {Collider} */
  collider = null;

  /** @public @type {number} */
  touch_position_x = 0;
  
  /** @public @type {number} */
  touch_position_y = 0;

  /**
   * @public
   * @param {Collider} collider
   */
  constructor(collider=null) {
    super();
    this.collider = collider;
  }

  /**
   * Gets converted coords
   * @param {number} x 
   * @param {number} y 
   * @returns {Array<number>}
   */
  _getResultCoords(x, y) {
    const canvas = this.gameObject.scene.game_engine.canvas;
    const r = canvas.getBoundingClientRect();
    const c = r.width / canvas.width;
    return Vector2.multiplyA(convertCanvas2Context(r, x - r.x, y - r.y), c / this.gameObject.scene.game_engine.render_settings.zoom);
  }

  /**
   * @public
   * @param {function(number, number)} clb
   * @param {boolean} with_mouse
   * @returns {this}
   */
  setOnTouchStart(clb, with_mouse=false) {
    this._touch_start_clb = clb;
    
    this.gameObject.scene.game_engine.canvas.addEventListener("touchstart", (ev) => {
      const coords = this._getResultCoords(ev.touches[0].clientX, ev.touches[0].clientY);
      if (this.collider.hasPoint(...coords)) {
        this.touched = true;
        this.start_position = coords;
        this.current_position = coords;
        clb(...coords);
      }
    });

    if (with_mouse) {
      this.gameObject.scene.game_engine.canvas.addEventListener("mousedown", (ev) => {
        const coords = this._getResultCoords(ev.clientX, ev.clientY);
        if (this.collider.hasPoint(...coords)) {
          this.touched = true;
          this.start_position = coords;
          this.current_position = coords;
          clb(...coords);
        }
      });
    }

    return this;
  }

  /**
   * @public
   * @param {function(number, number)} clb
   * @param {boolean} with_mouse
   * @returns {this}
   */
  setOnTouchEnd(clb, with_mouse=false) {
    this._touch_end_clb = (ev) => {
      if (!this.touched) return;
      this.touched = false;

      const coords = this._getResultCoords(ev.changedTouches[0].clientX, ev.changedTouches[0].clientY);
      this.current_position = coords;
      clb(...coords);
    };

    this.gameObject.scene.game_engine.canvas.addEventListener("touchend", this._touch_end_clb);

    if (with_mouse) {
      this.gameObject.scene.game_engine.canvas.addEventListener("mouseup", (ev) => {
        if (!this.touched) return;
        this.touched = false;

        const coords = this._getResultCoords(ev.clientX, ev.clientY);
        this.current_position = coords;
        clb(...coords);
      });
    }

    return this;
  }

  /**
   * @public
   * @param {function(number, number)} clb
   * @param {boolean} with_mouse
   * @returns {this}
   */
  setOnTouchMove(clb, with_mouse=false) {
    this._touch_move_clb = clb;

    this.gameObject.scene.game_engine.canvas.addEventListener("touchmove", (ev) => {
      if (!this.touched) return;
        const coords = this._getResultCoords(ev.touches[0].clientX, ev.touches[0].clientY);
        this.current_position = coords;
        clb(...coords);
    });

    if (with_mouse) {
      this.gameObject.scene.game_engine.canvas.addEventListener("mousemove", (ev) => {
        if (!this.touched) return;
        const coords = this._getResultCoords(ev.clientX, ev.clientY);
        this.current_position = coords;
        clb(...coords);
      });
    }

    return this;
  }
}