import React from 'react';
import ReactDOM from 'react-dom';
import Bridge from '@vkontakte/vk-bridge';

import { Core, CoreProvider } from './core/Core';

const core = new Core();

function Root() {

  return (
    <CoreProvider value={core}>
      <div>1</div>
    </CoreProvider>
  );
}

ReactDOM.render(<Root />, document.getElementById("root"));
Bridge.send("VKWebAppInit");