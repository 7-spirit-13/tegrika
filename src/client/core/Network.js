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
    this.ws = io(`ws${location.protocol == 'https:' ? 's' : ''}://${location.hostname}:${location.port}`);
    this.ws.on("connect", (data) => {
      const clb = (data) => {
        this.ws.off("authorization", clb);
        if (data.msg == "success") {
          self.Event.dispatchEvent(Events.WS_CONNECTED);
        } else {
          throw new EvalError("Error when receiving data from server");
        }
      }
      this.ws.emit("authorization").on("authorization", clb);
    })
  }

  this.findOpponent = () => {
    return new Promise((resolve, reject) => {
      let clb = data => {
        // Deleting old
        this.ws.off("find-me-an-opponent", clb);

        if (data.msg == 'success') {
          clb = (data) => {
          // Deleting old callback
            this.ws.off("start-playing", clb);

            console.log(data);
            resolve(data);
          }

          this.ws.on("start-playing", clb);
        } else {
          reject("find-me-an-opponent error");
        }
      }
      this.ws.emit("find-me-an-opponent").on("find-me-an-opponent", clb);
    });
  }
}