import { Socket, io } from 'socket.io-client';

export default function Network(self) {
  /** @type {Soket} */
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

  this.connect = (clb) => {
    this.ws = io(`ws://${location.hostname}`);
    this.ws("connect", clb);
  }
}