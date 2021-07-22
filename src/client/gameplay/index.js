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
    let ball = new GE.GameObject();
    this.scene.add(ball);
    ball.addComponent(new GE.COMPONENTS.Transform());
    console.log(ball.getComponent(GE.COMPONENTS.Transform));
  }
}