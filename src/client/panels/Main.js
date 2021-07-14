import React from 'react';
import { Panel } from "./Panel";

import Core from '../core/Core';

import Button from '../components/Button';

function PreloadPanel() {

  return (
    <div className="main-panel">
      <h1>Тегрика</h1>
      <div className="balls">
        <div className="ball ball-1"></div>
        <div className="ball ball-2"></div>
      </div>
      <Button>Начать играть</Button>
      <Button size="small" color="secondary">Обучение</Button>
    </div>
  )
}
 
export default new Panel("main", PreloadPanel);