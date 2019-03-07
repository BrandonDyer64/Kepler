module.exports = new class VarComponent extends Rete.Component {
  constructor() {
    super("Var");
    this.path = ["Data", "Variables"];
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    node.type = "literal";
    node.altName = " ";
    let out = new Rete.Output("value", "", stringSocket);

    return node.addControl(new StringInputControl("value")).addOutput(out);
  }

  code(node, inputs, add, outputs) {
    outputs.value = node.data.value;
  }
}();
