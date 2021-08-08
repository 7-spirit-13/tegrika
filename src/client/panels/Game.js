import React from 'react';

import { Panel } from './Panel';

import Core from '../core/Core';

import { Events } from '../core/Constants';

import { GamePlay } from '../gameplay';
import { isIphone } from '../core/Utils';

import Timer from '../ui/Timer';

/**
 * 
 * @param {*} props 
 * @returns 
 */
function GamePanel(props) {
  /** @type {React.Ref<HTMLCanvasElement>} */
  const canvasRef = React.createRef(null);
  const [game] = React.useState(new GamePlay(false, true));

  const [status, setStatus] = React.useState(0);
  const [winner, setWinner] = React.useState(null);
  const [beforeShown, setBeforeShown] = React.useState(true);

  React.useLayoutEffect(() => {
    const canvas = canvasRef.current;
    game.init(props.role);
    game.setCanvas(canvas);
    game.start();

    game.on_update_coords = (coords) => {
      Core.Network.sendCoords(coords);
    }

    game.on_update_touching_time = (time) => {
      setStatus(time / 5000);
    }

    let off_coords_listener = Core.Network.listen("coordinates-opponent", (coords) => {
      game.updateOpponentPosition(coords);
    });

    let off_touching_update_listener = Core.Network.listen("update-touching-time", (time) => {
      setStatus(time / 5000);
      game.touching_time = time;
    });

    let off_end_listener = Core.Network.listen("end-game", (winner) => {
      setWinner(props.role == winner);
    });

    const _isIphone = isIphone();

    (window.onresize = () => {
      const {width, height} = canvas.getBoundingClientRect();
      canvas.width  = width  * (1 + _isIphone);
      canvas.height = height * (1 + _isIphone);
    })();

    setTimeout(() => setBeforeShown(false), props.start_time - Date.now());

    return () => {
      off_coords_listener();
      off_touching_update_listener();
    }
  }, []);

  return (
    <div className="game-panel">
      <canvas ref={ canvasRef } />
      <div className="interface">
        <div className="status-bar">
          <div style={{width: `${status * 100}%`}} className="fill-bar"></div>
        </div>
        <div className="timer">
          <Timer to={props.end_time}></Timer>
        </div>
      </div>

      { winner !== null &&
        <div className="end-game">
          <h1>{winner ? "Вы победили!" : "Вы проиграли :("}</h1>
        </div>
      }

      { beforeShown &&
        <div className="before-start">
          <Timer to={props.start_time} />
        </div>
      }
    </div>
  );
}


export default new Panel("game", GamePanel);