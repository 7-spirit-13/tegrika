import React from 'react';
import ReactDOM from 'react-dom';
import Bridge from '@vkontakte/vk-bridge';

import { Core, CoreProvider } from './core/Core';
import { Events } from './core/Constants';
import { cs } from './core/Utils';
import panels from './panels/';

import('./styles/panels.sass');
import('./styles/components.sass');

const core = new Core();

function Root() {
  const [state, setState] = React.useState({
    panel: "preload"
  });

  React.useEffect(() => {
    return core.Event.addEventListener(Events.OPEN_PANEL, panel => {
      setState({ ...state, panel });
    });
  }, [state.panel]);

  return (
    <CoreProvider.Provider value={core}>
      { panels.map(panel => (
        <div key={panel.name} className={cs("panel", state.panel == panel.name ? "active" : "inactive")}>
          {React.createElement(panel.component)}
        </div>
      ))
      }
    </CoreProvider.Provider>
  );
}

ReactDOM.render(<Root />, document.getElementById("root"));
Bridge.send("VKWebAppInit");