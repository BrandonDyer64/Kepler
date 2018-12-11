const electron = require("electron");
const fs = require("fs");
const path = require("path");
const Rete = require("rete");
const AlightRenderPlugin = require("rete-alight-render-plugin");
const ConnectionPlugin = require("rete-connection-plugin");
const ContextMenuPlugin = require("rete-context-menu-plugin");
const TaskPlugin = require("rete-task-plugin");
const AreaPlugin = require("rete-area-plugin");
const remote = electron.remote;
const mainProcess = remote.require("./main");
const CodePlugin = require(path.resolve("./js/CodePluginLogical"));
const currentWindow = remote.getCurrentWindow();

var onMessageTask = null;
function receiveBot(msg) {
  setTimeout(async () => {
    await onMessageTask.run(msg);
  }, telegram.botSleep);
}

function receiveUser(msg) {
  telegram.sendBot(msg);
}

function statement(node, add, inputs, outputs, code) {
  console.log(node);
  console.log(node.outputs.exec.connections.length);
  function execute(code) {
    for (let i in inputs.exec) {
      inputs.exec[i].primary(code);
    }
  }
  if (!node.outputs.exec || node.outputs.exec.connections.length == 0) {
    execute(code);
  } else {
    outputs.exec = {
      primary: c => {
        const outcode = code + "\n" + c;
        execute(outcode);
      }
    };
  }
}

function formatCode(code) {
  code = code.replace(/\r/g, "");
  code = code.replace(/ +(?= )/g, "");
  code = code.replace(/\n /g, "\n");
  code = code.replace(/\n+(?=\n)/g, "");
  return code;
}

function indentCode(code) {
  return "  " + code.replace(/\n/g, "\n  ");
}

function converge(codeA, codeB) {
  console.log("converging");
  codeA = codeA.split("\n");
  codeB = codeB.split("\n");
  //return { codeA, codeB, convergent: "" };

  let convergent = "";
  while (
    codeA[codeA.length - 1] == codeB[codeB.length - 1] &&
    codeA.length > 0 &&
    codeB.length > 0
  ) {
    convergent = "\n" + codeA.pop() + convergent;
    codeB.pop();
  }
  return {
    codeA: indentCode(codeA.join("\n")),
    codeB: indentCode(codeB.join("\n")),
    convergent
  };
}

function createExecs(
  nameIn = "exec",
  nameOut = "exec",
  displayIn = "",
  displayOut = ""
) {
  return {
    execIn: new Rete.Input(nameIn, displayIn, actSocket, true),
    execOut: new Rete.Output(nameOut, displayOut, actSocket, false)
  };
}

var actSocket = new Rete.Socket("Action");
var strSocket = new Rete.Socket("String");
var boolSocket = new Rete.Socket("Boolean");
var floatSocket = new Rete.Socket("Float");
var stringSocket = new Rete.Socket("String");
var vector2Socket = new Rete.Socket("Vector2");
var vector3Socket = new Rete.Socket("Vector3");
var vector4Socket = new Rete.Socket("Vector4");
var anySocket = new Rete.Socket("Any");

anySocket.combineWith(boolSocket);
anySocket.combineWith(floatSocket);
anySocket.combineWith(vector2Socket);
anySocket.combineWith(vector3Socket);
anySocket.combineWith(vector4Socket);
anySocket.combineWith(stringSocket);
boolSocket.combineWith(anySocket);
floatSocket.combineWith(anySocket);
floatSocket.combineWith(vector2Socket);
floatSocket.combineWith(vector3Socket);
floatSocket.combineWith(vector4Socket);
floatSocket.combineWith(stringSocket);
vector2Socket.combineWith(anySocket);
vector2Socket.combineWith(vector3Socket);
vector2Socket.combineWith(vector4Socket);
vector3Socket.combineWith(anySocket);
vector3Socket.combineWith(vector4Socket);
vector4Socket.combineWith(anySocket);
stringSocket.combineWith(anySocket);

function anyify(name) {
  if (Array.isArray(name)) {
    return name[0].split("_m_")[0];
  } else {
    return name.split("_m_")[0];
  }
}

const JsRenderPlugin = {
  install(editor, params = {}) {
    editor.on("rendercontrol", ({ el, control }) => {
      if (control.render && control.render !== "js") return;
      console.log(el);
      control.handler(el, editor);
    });
  }
};

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
  }

  handler(el, editor) {
    var input = document.createElement("input");
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

class FunctionComponent extends Rete.Component {
  constructor() {
    super("Event");
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    var nameIn = new Rete.Input("name", "Name", anySocket);
    var paramsIn = new Rete.Input("params", "Params", anySocket);
    var out = new Rete.Output("exec", "", actSocket, false);

    nameIn.addControl(new StringInputControl("name"));
    paramsIn.addControl(new StringInputControl("params"));

    return node
      .addInput(nameIn)
      .addInput(paramsIn)
      .addOutput(out);
  }

  code(node, inputs, add, outputs) {
    outputs.exec = {
      primary: code => {
        code = indentCode(code);
        add(
          "" +
            `function ${node.data.name} (${node.data.params})` +
            `${code}` +
            `end`
        );
      }
    };
  }
}

class IfComponent extends Rete.Component {
  constructor() {
    super("Branch");
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    const { execIn, execOut: execTrue } = createExecs(
      "exec",
      "execTrue",
      "",
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
      if (codeTrue && codeFalse) {
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
}

class EventComponent extends Rete.Component {
  constructor(eventName, eventParams) {
    super("On " + eventName);
    this.path = ["Events"];
    this.eventName = eventName;
    this.eventParams = eventParams;
    let formatedParams = [];
    for (let i in eventParams) {
      formatedParams.push(eventParams[i].name);
    }
    formatedParams = formatedParams.join(", ");
    this.formatedParams = formatedParams;
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    var out = new Rete.Output("exec", "", actSocket, false);
    node.addOutput(out);

    for (let i in this.eventParams) {
      const param = this.eventParams[i];
      node.addOutput(new Rete.Output(param.name, param.name, param.socket));
    }

    return node;
  }

  code(node, inputs, add, outputs) {
    for (let i in this.eventParams) {
      const param = this.eventParams[i];
      outputs[param.name] = param.name;
    }
    outputs.exec = {
      primary: code => {
        code = indentCode(code);
        add(`
function ${this.eventName} (${this.formatedParams})
${code}
end`);
      }
    };
  }
}

class CustomComponent extends Rete.Component {
  constructor() {
    super("Custom");
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
}

class PrintComponent extends Rete.Component {
  constructor() {
    super("Print");
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    const { execIn, execOut } = createExecs();
    let strIn = new Rete.Input("str", "", stringSocket);

    return node
      .addInput(execIn)
      .addInput(strIn)
      .addOutput(execOut);
  }

  code(node, inputs, add, outputs) {
    statement(node, add, inputs, outputs, `print(${inputs.str})`);
  }
}

class StringComponent extends Rete.Component {
  constructor() {
    super("String");
    this.path = ["Literals"];
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    let out = new Rete.Output("value", "", stringSocket);

    return node.addControl(new StringInputControl("value")).addOutput(out);
  }

  code(node, inputs, add, outputs) {
    outputs.value = '"' + node.data.value + '"';
  }
}

class CompareComponent extends Rete.Component {
  constructor(name, operator) {
    super(name);
    this.name = name;
    this.operator = operator;
    this.path = ["Compare"];
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    let inA = new Rete.Input("inA", "", anySocket);
    let inB = new Rete.Input("inB", "", anySocket);
    let out = new Rete.Output("value", "", boolSocket);

    return node
      .addInput(inA)
      .addInput(inB)
      .addOutput(out);
  }

  code(node, inputs, add, outputs) {
    outputs.value = `(${inputs.inA} ${this.operator} ${inputs.inB})`;
  }
}

var components = [
  new IfComponent(),
  new FunctionComponent(),
  new CustomComponent(),
  new StringComponent(),
  new PrintComponent(),
  new EventComponent("Tick", [{ name: "delta", socket: floatSocket }]),
  new EventComponent("Create", []),
  new CompareComponent("Equals", "=="),
  new CompareComponent("Not", "~="),
  new CompareComponent("Greater Than", ">"),
  new CompareComponent("Less Than", "<"),
  new CompareComponent("Greater or Equal", ">="),
  new CompareComponent("Less or Equal", "<=")
];

var container = document.getElementById("editor");
var editor = new Rete.NodeEditor("demo@0.1.0", container);
editor.use(AlightRenderPlugin);
editor.use(ConnectionPlugin);
editor.use(ContextMenuPlugin, {
  searchBar: true,
  delay: 100,
  allocate(component) {
    return component.path || [];
  }
});
editor.use(JsRenderPlugin);
editor.use(TaskPlugin);

var engine = new Rete.Engine("demo@0.1.0");

components.map(c => {
  editor.register(c);
  engine.register(c);
});

const materialConfig = JSON.parse(
  fs.readFileSync(currentWindow.custom.path, "utf8")
);

console.log(materialConfig);
editor
  .fromJSON({
    id: "demo@0.1.0",
    nodes: materialConfig.props.nodes,
    groups: materialConfig.props.groups
  })
  .then(() => {
    editor.on("error", err => {
      alertify.error(err.message);
    });

    editor.on(
      "process connectioncreated connectionremoved nodecreated",
      async function() {
        if (engine.silent) return;
        console.log("process");
        await engine.abort();
        await engine.process(editor.toJSON());
        const editorJSON = editor.toJSON();
        materialConfig.props.nodes = editorJSON.nodes;
        materialConfig.props.groups = editorJSON.groups;
        CodePlugin.generate(engine, editor.toJSON()).then(
          ({ file: sourceCode, imports }) => {
            //sourceCode = formatCode(sourceCode);
            fs.writeFileSync(
              currentWindow.custom.path.split(".")[0] + ".lua",
              sourceCode,
              "utf8"
            );
            console.log(sourceCode);
            fs.writeFileSync(
              currentWindow.custom.path,
              JSON.stringify(materialConfig, null, 2),
              "utf8"
            );
            console.log(materialConfig);
          }
        );
      }
    );

    editor.trigger("process");
    editor.view.resize();
    AreaPlugin.zoomAt(editor);
  });
