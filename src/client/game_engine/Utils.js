import { Transform, TransformInstance } from "./components";
import { GameObject } from "./GameObject";
import { Vector2 } from "./math";

/**
 * @param {GameObject} gameObject
 * @returns {Transform}
 */
export function getTransform(gameObject) {
  return gameObject.getComponent(TransformInstance);
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {number} x
 * @param {number} y
 * @param {number} zoom
 * @returns {Array<number>}
 */
export function convertCanvas2ContextCoords(canvas, x, y, zoom=1) {
  const {width: w, height: h} = canvas.getBoundingClientRect();
  return Vector2.multiplyA([x - w / 2, h / 2 - y], canvas.width / w / zoom);
}