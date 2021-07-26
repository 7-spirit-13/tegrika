export class Vector2 {
  /**
   * @param {Array<number>} vec
   * @returns {Array<number>}
   */
  static normalizeA(vec) {
    let l = this.calcDistance(vec);
    return vec.map(v => v / l || 0);
  }

  /**
   * @param {Array<number>} vec
   * @param {Array<number>} _vec
   * @returns {Array<number>}
   */
  static substractA(vec, _vec) {
    return vec.map((v, i) => v - _vec[i]);
  }

  /**
   * @param {Array<number>} vec
   * @param {number} k
   * @returns {Array<number>}
   */
  static multiplyA(vec, k) {
    return vec.map(v => v * k);
  }

  /**
   * @param {Array<number>} vec
   * @param {Array<number>} _vec
   * @returns {Array<number>}
   */
  static sumA(vec, _vec) {
    return vec.map((v, i) => v + _vec[i]);
  }

  
  /**
   * @param {Array<number>} vec
   * @returns {number}
   */
  static calcDistance(vec) {
    return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
  }
}