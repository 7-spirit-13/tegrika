import { GameObject } from './GameObject';

export function ObjectManager() {
  /** @type {Set<GameObject>} */
  this.entities = new Set();

  /**
   * Add an object
   * @param {GameObject} obj
   */
  this.add = (obj) => {
    this.entities.add(obj);
  }

  /**
   * Delete an object
   * @param {GameObject} obj
   */
  this.remove = (obj) => {
    this.entities.delete(obj);
  }
}