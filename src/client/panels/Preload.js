import React from 'react';
import { Panel } from "./Panel";

import { CoreProvider } from './../core/Core';
import { Events } from './../core/Constants';

import('./Preload.sass');

function PreloadPanel() {
  const core = React.useContext(CoreProvider);

  React.useEffect(() => {
    let removeListener = core.Event.addEventListener(Events.WS_CONNECTED, () => {
      setTimeout(() => {
        core.Event.dispatchEvent(Events.OPEN_PANEL, ['main']);
      }, 500);
    })

    core.Network.connectWS();

    return removeListener;
  }, []);

  return (
    <div className="preload-container">
      <div className="logo">
        
      </div>
      
    </div>
  )
}

export default new Panel("preload", PreloadPanel);