import React from 'react';

import { Panel } from './Panel';

import Core from '../core/Core';

import { Events } from '../core/Constants';

import { Game } from '../game-engine';

function GamePanel() {
  const canvasRef = React.createRef(null);
  const [game] = React.useState(new Game());

  React.useLayoutEffect(() => {
    game.setCanvas(canvasRef.current);
    game.start();
  }, []);

  return (
    <canvas ref={ canvasRef } />
  );
}


export default new Panel("game", GamePanel);