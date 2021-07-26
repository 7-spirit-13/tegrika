import { GameEngine } from './GameEngine';
import { GameObject } from './GameObject';

export class Scene {
  /** @type {Set<GameObject>} */
  objects = null;

  /** @type {GameEngine} */
  game_engine = null;

  constructor() {
    this.objects = new Set();
  }

  /**
   * Add an object
   * @param {GameObject} obj
   */
  add(obj) {
    this.objects.add(obj);
    obj.scene = this;
  }

  /**
   * Delete an object
   * @param {GameObject} obj
   */
  remove(obj) {
    this.objects.delete(obj);
    obj.scene = null;
  }
}