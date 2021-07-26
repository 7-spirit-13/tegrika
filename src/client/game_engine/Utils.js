import { Transform, TransformInstance } from "./components";
import { GameObject } from "./GameObject";

/**
 * @param {GameObject} gameObject
 * @returns {Transform}
 */
export function getTransform(gameObject) {
  return gameObject.getComponent(TransformInstance);
}

/**
 * @param {HTMLCanvasElement | DOMRect} rect
 * @param {number} x
 * @param {number} y
 * @returns {Array<number>}
 */
export function convertCanvas2Context(rect, x, y) {
  return [x - rect.width / 2, rect.height / 2 - y];
}