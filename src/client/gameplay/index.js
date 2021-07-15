import { GameEngine } from '../game_engine';

/**
 * Abstract layer over engine
 */
export class GamePlay extends GameEngine {
  
  /**
   * @param {boolean} training training mode
   */
  constructor(training=false) {
    super(GameEngine);
  }
}