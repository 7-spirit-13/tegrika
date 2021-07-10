export default function Network(self) {
  this.online = () => this.requestAPI({ action: 'online' });

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

  this.uploadResource = (params) => this.requestAPI({ action: 'upload-resource', ...params })
  this.getResources = () => this.requestAPI({ action: 'get-resources' })
  this.deleteResources = (ids) => this.requestAPI({ action: 'delete-resources', ids })
}