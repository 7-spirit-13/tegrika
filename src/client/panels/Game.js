import React from 'react';

import { Panel } from './Panel';

import Core from '../core/Core';

import { Events } from '../core/Constants';

import { GamePlay } from '../gameplay';

function GamePanel() {
  /** @type {React.Ref<HTMLCanvasElement>} */
  const canvasRef = React.createRef(null);
  const [game] = React.useState(new GamePlay());

  React.useLayoutEffect(() => {
    const canvas = canvasRef.current;
    game.setCanvas(canvas);
    game.start();

    (window.onresize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    })();
  }, []);

  return (
    <div className="game-panel">
      <canvas ref={ canvasRef } />
    </div>
  );
}


export default new Panel("game", GamePanel);