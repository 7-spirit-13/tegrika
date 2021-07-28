import React from 'react';

import { Panel } from './Panel';

import Core from '../core/Core';

import { Events } from '../core/Constants';

import { GamePlay } from '../gameplay';
import { isIphone } from '../core/Utils';

/**
 * 
 * @param {*} props 
 * @returns 
 */
function GamePanel(props) {
  /** @type {React.Ref<HTMLCanvasElement>} */
  const canvasRef = React.createRef(null);
  const [game] = React.useState(new GamePlay(false, true));

  React.useLayoutEffect(() => {
    const canvas = canvasRef.current;
    game.setCanvas(canvas);
    game.start(props.role);
    game.on_update_coords = (coords) => {
      Core.Network.sendCoords(coords);
    }

    Core.Network.listenCoords((coords) => {
      game.updateOpponentPosition(coords);
    });

    const _isIphone = isIphone();

    (window.onresize = () => {
      canvas.width = window.innerWidth * (1 + _isIphone);
      canvas.height = window.innerHeight * (1 + _isIphone);
    })();
  }, []);

  return (
    <div className="game-panel">
      <canvas ref={ canvasRef } />
    </div>
  );
}


export default new Panel("game", GamePanel);