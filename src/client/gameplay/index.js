import * as GE from '../game_engine';

/**
 * Abstract layer over engine
 */
export class GamePlay extends GE.GameEngine {
  
  /**
   * @param {boolean} training training mode
   */
  constructor(training=false) {
    super();
    const ball = GE.OBJECTS.createCamera();
    this.scene.add(ball);
    ball.addComponent(new GE.COMPONENTS.Transform());
    ball.addComponent(new GE.COMPONENTS.RENDERERS.CircleRenderer());
  }
}