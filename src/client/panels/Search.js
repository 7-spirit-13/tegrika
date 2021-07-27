import React from 'react';
import Button from '../ui/Button';

import Core from '../core/Core';
import { Events } from './../core/Constants';

import { Panel } from './Panel';

function SearchAnimated() {
  const [n, setN] = React.useReducer(x => (x + 1) % 3, 0);

  React.useEffect(() => {
    const t = setTimeout(setN, 1000);
    return () => clearTimeout(t);
  }, [n]);

  return (
    <h2>Поиск соперника{'.'.repeat(n + 1)}</h2>
  );
}

function SearchPanel() {
  function onCancel() {
    Core.Event.dispatchEvent(Events.OPEN_PANEL, ['main']);
  }

  React.useEffect(() => {
    Core.Network.findOpponent().then((data) => {
      Core.Event.dispatchEvent(Events.OPEN_PANEL, ['game', data]);
    })
  });

  return (
    <div className="search-panel">
      <div className="title">
        <SearchAnimated />
      </div>
      <Button onClick={onCancel}>Отмена</Button>
    </div>
  );
}


export default new Panel("search", SearchPanel);