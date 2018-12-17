module.exports = new class SplitComponent extends Rete.Component {
  constructor() {
    super("Split");
    this.path = ["Control"];
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    node.type = "control";
    node.altName = " ";
    const { execIn, execOut: execFirst } = createExecs(
      "exec",
      "execFirst",
      null,
      null
    );
    const { execOut: execSecond } = createExecs("", "execSecond", null, null);

    return node
      .addInput(execIn)
      .addOutput(execFirst)
      .addOutput(execSecond);
  }

  code(node, inputs, add, outputs) {
    let codeFirst = null;
    let codeSecond = null;
    function checkBoth() {
      if (
        (codeFirst || node.outputs.execFirst.connections.length == 0) &&
        (codeSecond || node.outputs.execSecond.connections.length == 0)
      ) {
        const code = `${codeFirst || ""}\n${codeSecond || ""}`;
        for (let i in inputs.exec) {
          inputs.exec[i].primary(code);
        }
      }
    }
    outputs.execFirst = {
      primary: code => {
        codeFirst = code;
        checkBoth();
      }
    };
    outputs.execSecond = {
      primary: code => {
        codeSecond = code;
        checkBoth();
      }
    };
  }
}();
