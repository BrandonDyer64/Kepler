module.exports = new class CustomComponent extends Rete.Component {
  constructor() {
    super("Custom");
    this.path = ["Custom"];
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    const { execIn, execOut } = createExecs();

    return node
      .addInput(execIn)
      .addControl(new StringInputControl("code"))
      .addOutput(execOut);
  }

  code(node, inputs, add, outputs) {
    statement(node, add, inputs, outputs, node.data.code);
  }
}();
