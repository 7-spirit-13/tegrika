import React from 'react';
import { Panel } from "./Panel";
import { Events } from './../core/Constants';

import Core from '../core/Core';

import Button from '../ui/Button';

function PreloadPanel() {

  function openPanel(name) {
    return () => {
      Core.Event.dispatchEvent(Events.OPEN_PANEL, [name]);
    }
  }

  return (
    <div className="main-panel">
      <h1>Тегрика</h1>
      <div className="balls">
        <div className="ball ball-1"></div>
        <div className="ball ball-2"></div>
      </div>
      <Button onClick={openPanel("search")}>Начать играть</Button>
      <Button onClick={openPanel("learning")} size="small" color="secondary">Обучение</Button>
    </div>
  )
}
 
export default new Panel("main", PreloadPanel);