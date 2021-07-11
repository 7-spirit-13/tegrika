import React from 'react';
import { Panel } from "./Panel";

function PreloadPanel() {
  return (
    <div>preload</div>
  )
}

export default new Panel("preload", PreloadPanel);