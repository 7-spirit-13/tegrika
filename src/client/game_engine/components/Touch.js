import { Component } from "../Component";
import { Collider } from "./Collider";

export class Touch extends Component {
  /** @private @type {function} */
  _touch_start_clb = null;

  /** @private @type {function} */
  _touch_end_clb = null;

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
  constructor(collider) {
    super();
  }

  /**
   * @public
   * @param {function(TouchEvent)} clb
   */
  setOnTouchStart(clb) {
    this._touch_start_clb = clb;
    this.gameObject.scene.game_engine.canvas.addEventListener("touchstart", (ev) => {
      clb(ev);
    });
  }

  /**
   * @public
   * @param {function(TouchEvent)} clb
   */
  setOnTouchEnd(clb) {
    this._touch_end_clb = clb;
    this.gameObject.scene.game_engine.canvas.addEventListener("touchend", (ev) => {
      clb(ev);
    });
  }
}