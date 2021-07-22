import { GameObject } from './GameObject';

export function Scene() {
  /** @type {Set<GameObject>} */
  this.objects = new Set();

  /**
   * Add an object
   * @param {GameObject} obj
   */
  this.add = (obj) => {
    this.objects.add(obj);
  }

  /**
   * Delete an object
   * @param {GameObject} obj
   */
  this.remove = (obj) => {
    this.objects.delete(obj);
  }
}