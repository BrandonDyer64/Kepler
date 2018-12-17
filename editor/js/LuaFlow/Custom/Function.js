const Rete = require("rete");
const { StringInputControl } = require("../InputControls");

module.exports = new class FunctionComponent extends Rete.Component {
  constructor() {
    super("Function");
    this.path = ["Custom"];
    this.numParams = 5;
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    node.type = "custom";
    console.log(node);
    var out = new Rete.Output("exec", "", actSocket, false);
    node.addOutput(out);
    for (let i = 1; i <= this.numParams; i++) {
      node.addOutput(new Rete.Output(`p${i}`, `${i}`, anySocket));
    }

    return node.addControl(new StringInputControl("name"));
  }

  code(node, inputs, add, outputs) {
    const varnames = [];
    for (let i = 1; i <= this.numParams; i++) {
      const varname = uniqueVar(`${node.data.name}`);
      outputs[`p${i}`] = varname;
      varnames.push(varname);
    }
    const params = varnames.join(", ");
    outputs.exec = {
      primary: code => {
        code = indentCode(code);
        add(
          "" +
            `\nfunction ${node.data.name} (${params})\n` +
            `${code}\n` +
            `end\n`
        );
      }
    };
  }
}();
