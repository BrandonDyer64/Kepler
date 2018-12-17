const EventHandler = require("./EventHandler.js");

class EditorWindow extends EventHandler {
  constructor(name) {
    super();
    this.name = name;
    this.panels = [];
  }
}

module.exports = EditorWindow;
