module.exports = new class MakeVarComponent extends Rete.Component {
  constructor() {
    super("Variable");
    this.contextMenuName = "New";
    this.path = ["Data", "Variables"];
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    const { execIn, execOut } = createExecs();
    let valIn = new Rete.Input("value", "", anySocket);

    return node
      .addInput(execIn)
      .addInput(valIn)
      .addControl(new StringInputControl("varname"))
      .addOutput(execOut);
  }

  code(node, inputs, add, outputs) {
    statement(
      node,
      add,
      inputs,
      outputs,
      `local ${node.data.varname} = ${inputs.value[0] || "0"}`
    );
  }
}();
