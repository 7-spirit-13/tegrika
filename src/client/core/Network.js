import { Core } from './Core';
import { Socket, io } from 'socket.io-client';
import { Events } from './Constants';
import * as Utils from './Utils';

const IN_BROWSER = typeof location !== 'undefined' && location.hostname.length !== 0;
const HOST_NAME = IN_BROWSER ? location.hostname : '7-spirit-13.online';
const PORT = IN_BROWSER ? location.port : 443;
const PROTO_POSTFIX = IN_BROWSER && location.protocol === 'http:' ? '' : 's';

/**
 * @param {Core} self
 */
export default function Network(self) {
  /** @type {Socket} */
  this.ws = null;

  this.requestAPI = (params) => {
    // const seed = Math.random().toString(36).slice(2);
    // const secret = sha256.hmac(API_KEY, seed);
    return fetch(`http${PROTO_POSTFIX}://${HOST_NAME}:${PORT}/api`, {
      method: 'POST',
      // body: JSON.stringify({ ...params, uid: UID, secret, seed }),
      body: JSON.stringify({ ...params }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json());
  }

  this.connectWS = (clb) => {
    this.ws = io(`ws${PROTO_POSTFIX}://${HOST_NAME}:${PORT}`);
    this.ws.on("connect", (data) => {
      console.log('websocket connected');
      const clb = (data) => {
        this.ws.off("authorization", clb);
        if (data.msg == "success") {
          console.log("websocket connection established");
          self.Event.dispatchEvent(Events.WS_CONNECTED);
        } else {
          throw new EvalError("Error when receiving data from server");
        }
      }
      this.ws.emit("authorization").on("authorization", clb);
    });
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
            const offset = data.server_utc - Date.now();
            data.start_time += offset;
            data.end_time += offset;
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

  this.sendCoords = (coords) => {
    this.ws.emit("update-coordinates", Float32Array.from(coords));
  }

  this.cancel = () => {
    this.ws.emit("cancel");
  }

  this.listen = (eventName, clb) => {

    let _clb = (data) => {
      clb(data);
    }

    this.ws.on(eventName, _clb);

    return () => this.ws.off(eventName, _clb);
  }
}