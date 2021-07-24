import { RectRenderer } from "../components/renderers/RectRenderer";
import { Transform } from "../components/Transform";
import { GameObject } from "../GameObject";

/**
 * @param {number} width
 * @param {number} height
 * @returns {GameObject}
 */
export default function createRect(width=50, height=50) {
  const obj = new GameObject();
  obj.addComponent(new Transform());
  
  const renderer = new RectRenderer();
  renderer.width = width;
  renderer.height = height;
  obj.addComponent(renderer);
  return obj;
}