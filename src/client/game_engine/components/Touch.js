import { Component } from "../Component";
import { Vector2 } from "../math";
import { convertCanvas2ContextCoords } from "../Utils";
import { Collider } from "./Collider";

export class Touch extends Component {
  /** @private @type {function} */
  _touch_start_clb = null;

  /** @private @type {function} */
  _touch_end_clb = null;

  /** @private @type {function} */
  _touch_move_clb = null;

  /** @private @type {function} */
  _mouse_move_clb = null;

  /** @private @type {function} */
  _mouse_down_clb = null;

  /** @private @type {function} */
  _mouse_end_clb = null;

  /** @private @type {function} */


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
    return convertCanvas2ContextCoords(canvas, x - r.x, y - r.y, this.gameObject.scene.game_engine.render_settings.zoom);
  }

  /**
   * @public
   * @param {function(number, number)} clb
   * @param {boolean} with_mouse
   * @returns {this}
   */
  setOnTouchStart(clb, with_mouse=false) {
    this._touch_start_clb = clb;
    
    this.gameObject.scene.game_engine.canvas.addEventListener("touchstart", this._touch_start_clb = (ev) => {
      const coords = this._getResultCoords(ev.touches[0].clientX, ev.touches[0].clientY);
      if (this.collider.hasPoint(...coords)) {
        this.touched = true;
        this.start_position = coords;
        this.current_position = coords;
        clb(...coords);
      }
    });

    if (with_mouse) {
      this.gameObject.scene.game_engine.canvas.addEventListener("mousedown", this._mouse_down_clb = (ev) => {
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
    ;

    this.gameObject.scene.game_engine.canvas.addEventListener("touchend", this._touch_end_clb = (ev) => {
      if (!this.touched) return;
      this.touched = false;

      const coords = this._getResultCoords(ev.changedTouches[0].clientX, ev.changedTouches[0].clientY);
      this.current_position = coords;
      clb(...coords);
    });

    if (with_mouse) {
      this.gameObject.scene.game_engine.canvas.addEventListener("mouseup", this._mouse_end_clb = (ev) => {
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

    this.gameObject.scene.game_engine.canvas.addEventListener("touchmove", this._touch_move_clb = (ev) => {
      if (!this.touched) return;
        const coords = this._getResultCoords(ev.touches[0].clientX, ev.touches[0].clientY);
        this.current_position = coords;
        clb(...coords);
    });

    if (with_mouse) {
      this.gameObject.scene.game_engine.canvas.addEventListener("mousemove", this._mouse_move_clb = (ev) => {
        if (!this.touched) return;
        const coords = this._getResultCoords(ev.clientX, ev.clientY);
        this.current_position = coords;
        clb(...coords);
      });
    }

    return this;
  }

  /**
   * Releases all event callbacks
   */
  destroy() {
    const canvas = this.gameObject.scene.game_engine.canvas;
    canvas.removeEventListener("touchstart", this._touch_start_clb);
    canvas.removeEventListener("touchmove" , this._touch_move_clb );
    canvas.removeEventListener("touchend"  , this._touch_end_clb  );
    canvas.removeEventListener("mousedown" , this._mouse_down_clb );
    canvas.removeEventListener("mousemove" , this._mouse_move_clb );
    canvas.removeEventListener("mouseup"   , this._mouse_end_clb  );
  }
}