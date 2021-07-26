import { Core } from './Core';
import { Socket, io } from 'socket.io-client';
import { Events } from './Constants';

/**
 * @param {Core} self
 */
export default function Network(self) {
  /** @type {Socket} */
  this.ws = null;

  this.requestAPI = (params) => {
    // const seed = Math.random().toString(36).slice(2);
    // const secret = sha256.hmac(API_KEY, seed);
    return fetch('/api', {
      method: 'POST',
      // body: JSON.stringify({ ...params, uid: UID, secret, seed }),
      body: JSON.stringify({ ...params }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json());
  }

  this.connectWS = (clb) => {
    this.ws = io(`ws${location.protocol == 'https' ? 's' : ''}://${location.hostname}:${location.port}`);
    this.ws.on("connect", () => {
      self.Event.dispatchEvent(Events.WS_CONNECTED);
    });
  }
}