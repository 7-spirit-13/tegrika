import React from 'react';

import { CoreProvider } from './../core/Core';
import { Events } from './../core/Constants';
import { Panel } from "./Panel";

import Spinner from './../components/Spinner';

function PreloadPanel() {
  const core = React.useContext(CoreProvider);

  React.useEffect(() => {
    let removeListener = core.Event.addEventListener(Events.WS_CONNECTED, () => {
      setTimeout(() => {
        // core.Event.dispatchEvent(Events.OPEN_PANEL, ['main']);
      }, 500);
    })

    core.Network.connectWS();

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