module.exports = new class RepeatComponent extends Rete.Component {
  constructor() {
    super("Repeat");
    this.path = ["Control"];
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    const { execIn, execOut: execTrue } = createExecs(
      "exec",
      "execRepeat",
      null,
      "Repeat"
    );
    const { execOut: execFalse } = createExecs("", "execThen", "", "");

    var conditionIn = new Rete.Input("iterations", "Times", floatSocket);
    var itOut = new Rete.Output("iteration", "X", floatSocket);

    return node
      .addInput(execIn)
      .addInput(conditionIn)
      .addOutput(execTrue)
      .addOutput(itOut)
      .addOutput(execFalse);
  }

  code(node, inputs, add, outputs) {
    let codeRepeat = null;
    let codeThen = null;
    const iVar = uniqueVar("Repeat");
    function checkBoth() {
      if (
        codeRepeat &&
        (codeThen || node.outputs.execThen.connections.length == 0)
      ) {
        codeRepeat = indentCode(codeRepeat);
        const code = `for ${iVar} = 1, ${inputs.iterations}, 1 do
${codeRepeat}
end
${codeThen || ""}`;
        for (let i in inputs.exec) {
          inputs.exec[i].primary(code);
        }
      }
    }
    outputs.execRepeat = {
      primary: code => {
        codeRepeat = code;
        checkBoth();
      }
    };
    outputs.execThen = {
      primary: code => {
        codeThen = code;
        checkBoth();
      }
    };
    outputs.iteration = iVar;
  }
}();
