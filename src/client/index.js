
import React from 'react';
import ReactDOM from 'react-dom';
import Bridge from '@vkontakte/vk-bridge';

import { Events } from './core/Constants';
import { cs } from './core/Utils';
import panels from './panels/';

import Core from './core/Core';

function Root() {
  const [state, setState] = React.useState({
    panel: "preload"
  });

  React.useEffect(() => {
    return Core.Event.addEventListener(Events.OPEN_PANEL, panel => {
      setState({ ...state, panel });
    });
  }, [state.panel]);

  React.useLayoutEffect(() => {
    Bridge.send("VKWebAppInit");
  });

  return (
    <>
      { panels.filter(v => v.name == state.panel).map(panel => (
        <div key={panel.name} className={cs("panel", state.panel == panel.name ? "active" : "inactive")}>
          {React.createElement(panel.component)}
        </div>
      ))
      }
    </>
  );
}

import('./styles/index.scss').then(() => {
  ReactDOM.render(<Root />, document.getElementById("root"));
});
