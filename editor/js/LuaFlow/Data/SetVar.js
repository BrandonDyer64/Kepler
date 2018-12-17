module.exports = new class SetVarComponent extends Rete.Component {
  constructor() {
    super("Set");
    this.contextMenuName = "Set Variable";
    this.path = ["Data"];
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    node.altName = " ";
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
      `${node.data.varname} = ${inputs.value}`
    );
  }
}();
