import * as GE from '../game_engine';
GE
/**
 * Abstract layer over engine
 */
export class GamePlay extends GE.GameEngine {
  
  /**
   * @param {boolean} training training mode
   */
  constructor(training=false) {
    super();
    
  }
}