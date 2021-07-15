import React from 'react';

import Core from '../core/Core';
import { Events } from './../core/Constants';
import { Panel } from "./Panel";

import Spinner from '../ui/Spinner';

function PreloadPanel() {

  React.useEffect(() => {
    let removeListener = Core.Event.addEventListener(Events.WS_CONNECTED, () => {
      setTimeout(() => {
        Core.Event.dispatchEvent(Events.OPEN_PANEL, ['main']);
      }, 500);
    })

    Core.Network.connectWS();

    return removeListener;
  }, []);

  return (
    <div className="preload-container">
      <div className="logo">
        
      </div>
      <Spinner size="large" />
    </div>
  )
}

export default new Panel("preload", PreloadPanel);