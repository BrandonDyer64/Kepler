"use strict";
class EventHandler {
  constructor() {
    this.events = new Map();
  }

  trigger(eventName, params) {
    const events = this.events;
    if (events.has(eventName)) {
      const triggers = events.get(eventName);
      for (let i in triggers) {
        triggers[i](params);
      }
    }
  }

  on(eventNames, callback) {
    eventNames = eventNames.split(" ");
    for (let i in eventNames) {
      const eventName = eventNames[i];
      if (this.events.has(eventName)) {
        this.events.get(eventName).push(callback);
      } else {
        this.events.set(eventName, [callback]);
      }
    }
  }
}

module.exports = EventHandler;
