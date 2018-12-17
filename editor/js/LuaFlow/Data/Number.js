module.exports = new class NumberComponent extends Rete.Component {
  constructor() {
    super("Number");
    this.path = ["Data"];
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    node.type = "literal";
    node.altName = " ";
    let out = new Rete.Output("value", "", floatSocket);

    return node.addControl(new StringInputControl("value")).addOutput(out);
  }

  code(node, inputs, add, outputs) {
    outputs.value = node.data.value;
  }
}();
