let c_key = 0;

export function registerComponent() {
  return c_key++;
}

export class Component {
  // Init
  init(){};

  // Calculating process
  update(){};

  // Rendering process
  render(){};
}