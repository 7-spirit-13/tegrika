import React from 'react';

import { Panel } from './Panel';

import Core from '../core/Core';

import { Events } from '../core/Constants';

import { GamePlay } from '../gameplay';
import { isIphone } from '../core/Utils';

import * as GameConstants from '../gameplay/constants';

import Button from '../ui/Button';

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

  /** @type {React.Ref<HTMLDivElement} */
  const beforeStartRef = React.createRef(null);

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

    const end_timeout = setTimeout(() => setBeforeShown(false), props.start_time - Date.now());

    return () => {
      off_coords_listener();
      off_touching_update_listener();
      off_end_listener();
      window.onresize = null;
      clearTimeout(end_timeout);
      game.destroy();
    }
  }, []);

  React.useLayoutEffect(() => {
    if (!beforeShown) return;

    // Меняем размер стартового экрана
    const w = window.innerWidth;
    const h = window.innerHeight;

    const z = Math.min((w - 20) / GameConstants.MAP_WIDTH, (h - 30) / GameConstants.MAP_HEIGHT);
    beforeStartRef.current.style.width  = `${GameConstants.MAP_WIDTH  * z}px`;
    beforeStartRef.current.style.height = `${GameConstants.MAP_HEIGHT * z}px`;
  }, [beforeShown]);

  function openPanel(name) {
    return () => {
      Core.Event.dispatchEvent(Events.OPEN_PANEL, [name]);
    }
  }

  return (
    <div className="game-panel">
      <canvas ref={ canvasRef } />
      <div className="interface">
        <div className="status-bar">
          <div style={{width: `${status * 100}%`}} className="fill-bar"></div>
        </div>
        <div className="timer">
          <Timer to={props.end_time} mode={Timer.Modes.MinSec}></Timer>
        </div>
      </div>

      { winner !== null &&
        <div className="end-game">
          <h1>{winner ? "Вы победили!" : "Вы проиграли :("}</h1>
          <Button onClick={openPanel("search")}>Играть снова</Button>
          <Button onClick={openPanel("main")} size="small" color="secondary">Главное меню</Button>
        </div>
      }

      { beforeShown &&
        <div className="before-start-wrapper">
          <div ref={beforeStartRef} className="before-start">
            <div className="timer">
              <Timer to={props.start_time} />
            </div>
            <div className="description">
              <h3>Вы - { props.role == 'overtake' ? 'охотник' : 'жертва'}</h3>
              <span className="descr-text">Ваша задача: {props.role == 'overtake' ? 'соприкасаться с противником до тех пор, пока ползунок не дойдёт до конца' : 'избегать соприкосновения с противником'}</span>
              <span className="descr-text">Ограничение по времени: 1 минута</span>
            </div>
          </div>
        </div>
      }
    </div>
  );
}


export default new Panel("game", GamePanel);