module.exports = class PubSub {
  constructor() {
    this.events = {};
  }

  publish(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => {
        callback(data);
      });
    }
  }

  subscribe(event, callback) {
    this.events[event]
      ? this.events[event].push(callback)
      : (this.events[event] = [callback]);
  }
};
