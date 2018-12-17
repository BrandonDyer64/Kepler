module.exports = new class BranchComponent extends Rete.Component {
  constructor() {
    super("Branch");
    this.path = ["Control"];
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    const { execIn, execOut: execTrue } = createExecs(
      "exec",
      "execTrue",
      null,
      "True"
    );
    const { execOut: execFalse } = createExecs("", "execFalse", "", "False");

    var conditionIn = new Rete.Input("condition", "", boolSocket);

    return node
      .addInput(execIn)
      .addInput(conditionIn)
      .addOutput(execTrue)
      .addOutput(execFalse);
  }

  code(node, inputs, add, outputs) {
    let codeTrue = null;
    let codeFalse = null;
    function checkBoth() {
      if (
        (codeTrue || node.outputs.execTrue.connections.length == 0) &&
        (codeFalse || node.outputs.execFalse.connections.length == 0)
      ) {
        const { codeA, codeB, convergent } = converge(codeTrue, codeFalse);
        const code = `if ${inputs.condition} then
${codeA}
else
${codeB}
end${convergent}`;
        for (let i in inputs.exec) {
          inputs.exec[i].primary(code);
        }
      }
    }
    outputs.execTrue = {
      primary: code => {
        codeTrue = code;
        checkBoth();
      }
    };
    outputs.execFalse = {
      primary: code => {
        codeFalse = code;
        checkBoth();
      }
    };
  }
}();
