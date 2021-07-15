import React from 'react';

import { Panel } from './Panel';

import Core from '../core/Core';

import { Events } from '../core/Constants';


function Game() {


  return (
    <canvas />
  );
}


export default new Panel("game", Game);