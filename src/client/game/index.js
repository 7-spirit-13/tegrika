import ObjectManager from './ObjectManager';

export function Game(_canvas=null) {
  
  /** @type {HTMLCanvasElement} */
  this.canvas = _canvas;

  this.setCanvas = (newCanvas) => {
    this.canvas = newCanvas;
    this.canvas.getContext('2d');
  }

  /** @type {ObjectManager} */
  this.objects = new ObjectManager();


  /**
   * Updates the objects
   */
  this.update = () => {
    this.objects.entities.forEach(v => v.update());
  }

  /**
   * Drawing the objects
   */
  this.render = () => {
    this.objects.entities.forEach(v => v.render());
  }

  /**
   * Updates and renders objects
   */
  this.cycle = () => {
    this.update();
    this.render();
  }
}