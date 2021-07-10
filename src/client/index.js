import React from 'react';
import ReactDOM from 'react-dom';
import Bridge from '@vkontakte/vk-bridge';


function Root() {

  return (
    <div style={{background: "white"}}>1</div>
  );
}

ReactDOM.render(<Root />, document.getElementById("root"));
Bridge.send("VKWebAppInit");