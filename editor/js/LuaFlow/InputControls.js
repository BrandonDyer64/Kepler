const Rete = require("rete");

class FloatInputControl extends Rete.Control {
  constructor(key) {
    super(key);
    this.render = "js";
    this.key = key;
  }

  handler(el, editor) {
    var input = document.createElement("input");
    el.appendChild(input);

    var text = this.getData(this.key) || "";

    input.value = text;
    this.putData(this.key, text);
    input.addEventListener("change", () => {
      if (!input.value.includes(".")) {
        input.value += ".0";
      }
      this.putData(this.key, input.value);
      editor.trigger("process");
    });
  }
}

class StringInputControl extends Rete.Control {
  constructor(key) {
    super(key);
    this.render = "js";
    this.key = key;
    this.events = [];
  }

  handler(el, editor) {
    var input = document.createElement("input");
    el.appendChild(input);

    var text = this.getData(this.key) || "";

    input.value = text;
    this.putData(this.key, text);
    input.addEventListener("change", () => {
      for (let i in this.events) {
        this.events[i](input.value);
      }
      this.putData(this.key, input.value);
      editor.trigger("process");
    });
  }
}

class TextInputControl extends Rete.Control {
  constructor(key) {
    super(key);
    this.render = "js";
    this.key = key;
  }

  handler(el, editor) {
    var input = document.createElement("textarea");
    el.appendChild(input);

    var text = this.getData(this.key) || "";

    input.value = text;
    this.putData(this.key, text);
    input.addEventListener("change", () => {
      this.putData(this.key, input.value);
      editor.trigger("process");
    });
  }
}

module.exports = { FloatInputControl, StringInputControl, TextInputControl };
