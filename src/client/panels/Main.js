import React from 'react';
import { Panel } from "./Panel";

import { CoreProvider } from './../core/Core';

function PreloadPanel() {
  const core = React.useContext(CoreProvider);

  return (
    <div>main</div>
  )
}

export default new Panel("main", PreloadPanel);