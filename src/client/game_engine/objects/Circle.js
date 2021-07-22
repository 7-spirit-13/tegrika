import { CircleRenderer } from "../components/renderers/CircleRenderer";
import { Transform } from "../components/Transform";
import { GameObject } from "../GameObject";

/**
 * @returns {GameObject}
 */
export default function createCircle() {
  const obj = new GameObject();
  obj.addComponent(new Transform());
  obj.addComponent(new CircleRenderer());
  return obj;
}