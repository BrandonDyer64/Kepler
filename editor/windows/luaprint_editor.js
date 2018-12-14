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
const pug = require("pug");
const nodeTemplate = pug.compileFile(path.resolve("./js/nodeTemplate.pug"));
const currentWindow = remote.getCurrentWindow();

var onMessageTask = null;
function receiveBot(msg) {
  setTimeout(async () => {
    await onMessageTask.run(msg);
  }, telegram.botSleep);
}

var pluginsIncluded = [];

function receiveUser(msg) {
  telegram.sendBot(msg);
}

function statement(node, add, inputs, outputs, code) {
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

const uVars = new Map();

function uniqueVar(varname = null) {
  if (varname) varname = `_${varname}_`;
  else varname = "_";
  let varnum = 1;
  if (uVars.has(varname)) varnum = uVars.get(varname);
  else uVars.set(varname, varnum);
  uVars.set(varname, varnum + 1);
  var text = "ku" + varname + varnum;

  return text;
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
  if (!codeA || !codeB)
    return {
      codeA: indentCode(codeA || ""),
      codeB: indentCode(codeB || ""),
      convergent: ""
    };
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
  displayIn = null,
  displayOut = null
) {
  return {
    execIn: new Rete.Input(nameIn, displayIn || "▶", actSocket, true),
    execOut: new Rete.Output(nameOut, displayOut || "▶", actSocket, false)
  };
}

var actSocket = new Rete.Socket("Action");
var boolSocket = new Rete.Socket("Boolean");
var floatSocket = new Rete.Socket("Float");
var stringSocket = new Rete.Socket("String");
var vector2Socket = new Rete.Socket("Vector2");
var vector3Socket = new Rete.Socket("Vector3");
var vector4Socket = new Rete.Socket("Vector4");
var anySocket = new Rete.Socket("Any");

var typeRef = {
  Action: actSocket,
  Boolean: boolSocket,
  Number: floatSocket,
  String: stringSocket,
  Any: anySocket
};

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
    this.events = [];
  }

  handler(el, editor) {
    var input = document.createElement("input");
    el.appendChild(input);

    var text = this.getData(this.key) || "";

    input.value = text;
    this.putData(this.key, text);
    input.addEventListener("change", () => {
      for (let i in this.events) {
        this.events[i](input.value);
      }
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
    super("Function");
    this.path = ["Custom"];
    this.numParams = 5;
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
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
}

class IfComponent extends Rete.Component {
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
}

class RepeatComponent extends Rete.Component {
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
}

class SplitComponent extends Rete.Component {
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
    node.type = "event";
    var out = new Rete.Output("exec", "▶", actSocket, false);
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
    this.path = ["Data"];
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
    outputs.value = '"' + node.data.value + '"';
  }
}

class NumberComponent extends Rete.Component {
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
}

class OperatorComponent extends Rete.Component {
  constructor(menu, socketType, name, operator, inputSocketType = anySocket) {
    super(name);
    this.name = name;
    this.operator = operator;
    this.socketType = socketType;
    this.inputSocketType = inputSocketType;
    this.path = [...["Operators"], ...menu];
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    node.type = "operator";
    node.hideTitle = true;
    node.showCenterTitle = true;
    node.altName = this.operator;
    let inA = new Rete.Input("inA", "", this.inputSocketType);
    let inB = new Rete.Input("inB", "", this.inputSocketType);
    let out = new Rete.Output("value", "", this.socketType);

    return node
      .addInput(inA)
      .addInput(inB)
      .addOutput(out);
  }

  code(node, inputs, add, outputs) {
    outputs.value = `(${inputs.inA} ${this.operator} ${inputs.inB})`;
  }
}

function extractPluginData(code) {
  try {
    const name = code.match(/function (.*) \(/)[1];
    const types = code.match(/-- params: (.*)\n/)[1].split(", ");
    const params = code.match(/function(.*)\((.*)\)/)[2].split(", ");
    const returnTypeString = code.match(/return(.*)-- (.*)\n/);
    const returnType =
      returnTypeString && returnTypeString.length == 3
        ? returnTypeString[2]
        : null;
    return {
      name,
      types,
      params,
      returnType
    };
  } catch (e) {
    return {
      name: "Error.",
      types: ["Any"],
      params: ["Invalid Lua"],
      returnType: null,
      error: true
    };
  }
}

class PluginComponent extends Rete.Component {
  constructor(owner, pkg, data) {
    super(name);
    this.paramTypes = extractPluginData(data.data);
    this.name = owner + "." + pkg + "." + this.paramTypes.name;
    this.contextMenuName = this.paramTypes.name;
    this.path = [owner, pkg];
    this.plugindata = data;
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    node.type = "plugin";
    node.altName = this.paramTypes.name;
    if (!this.paramTypes.returnType) {
      const { execIn, execOut } = createExecs("exec", "exec");
      node.addInput(execIn).addOutput(execOut);
    } else {
      node.addOutput(
        new Rete.Output("out", "out", typeRef[this.paramTypes.returnType])
      );
    }

    for (let i in this.paramTypes.params) {
      const paramName = this.paramTypes.params[i];
      const type =
        this.paramTypes.types.length > i ? this.paramTypes.types[i] : "Any";
      node.addInput(new Rete.Input(paramName, paramName, typeRef[type]));
    }

    return node;
  }

  code(node, inputs, add, outputs) {
    if (!pluginsIncluded.includes(this.name)) {
      pluginsIncluded.push(this.name);
      add(this.plugindata.data);
    }
    let paramString = [];
    for (let i in this.paramTypes.params) {
      const paramName = this.paramTypes.params[i];
      console.log(inputs[paramName]);
      paramString.push(inputs[paramName][0] || "nil");
    }
    paramString = paramString.join(", ");
    if (!this.paramTypes.returnType) {
      statement(
        node,
        add,
        inputs,
        outputs,
        `${this.paramTypes.name}(${paramString})`
      );
    } else {
      outputs.out = `${this.paramTypes.name}(${paramString})`;
    }
  }
}

var components = [
  new IfComponent(),
  new SplitComponent(),
  new FunctionComponent(),
  new CustomComponent(),
  new StringComponent(),
  new NumberComponent(),
  new PrintComponent(),
  new RepeatComponent(),
  new EventComponent("Tick", [{ name: "delta", socket: floatSocket }]),
  new EventComponent("Create", []),
  new OperatorComponent(["Compare"], boolSocket, "Equals", "=="),
  new OperatorComponent(["Compare"], boolSocket, "Not Equal", "~="),
  new OperatorComponent(["Compare"], boolSocket, "Greater Than", ">"),
  new OperatorComponent(["Compare"], boolSocket, "Less Than", "<"),
  new OperatorComponent(["Compare"], boolSocket, "Greater or Equal", ">="),
  new OperatorComponent(["Compare"], boolSocket, "Less or Equal", "<="),
  new OperatorComponent(["Math"], floatSocket, "Add", "+", floatSocket),
  new OperatorComponent(["Math"], floatSocket, "Subtract", "-", floatSocket),
  new OperatorComponent(["Math"], floatSocket, "Multiply", "*", floatSocket),
  new OperatorComponent(["Math"], floatSocket, "Divide", "/", floatSocket),
  new OperatorComponent(["Math"], floatSocket, "Modulo", "%", floatSocket),
  new OperatorComponent(["Logical"], boolSocket, "And", "and", boolSocket),
  new OperatorComponent(["Logical"], boolSocket, "Or", "or", boolSocket)
];

const pluginLua = currentWindow.custom.loadPackageFiles([".lua"]);
for (let owner in pluginLua) {
  for (let pkg in pluginLua[owner]) {
    for (let data in pluginLua[owner][pkg]) {
      if (pluginLua[owner][pkg][data].data)
        components.push(
          new PluginComponent(owner, pkg, pluginLua[owner][pkg][data])
        );
    }
  }
}

function refreshNodes() {
  const nodesView = Array.from(editor.view.nodes.values());
  nodesView.map(node => {
    refreshNode(node);
  });
}

function refreshNode(node) {
  node.translate(node.node.position[0], node.node.position[1]);
}

var container = document.getElementById("editor");
var editor = new Rete.NodeEditor("demo@0.1.0", container);
editor.use(AlightRenderPlugin, { template: nodeTemplate() });
editor.use(ConnectionPlugin, { curvature: 0 });
editor.use(ContextMenuPlugin, {
  searchBar: true,
  delay: 100,
  allocate(component) {
    return component.path || [];
  },
  rename(component) {
    return component.contextMenuName || component.name;
  }
});
editor.use(JsRenderPlugin);
editor.use(TaskPlugin);
editor.use(AreaPlugin, {
  scaleExtent: true,
  snap: { size: 8, dynamic: true }
});

var engine = new Rete.Engine("demo@0.1.0");

components.map(c => {
  editor.register(c);
  engine.register(c);
});

const materialConfig = JSON.parse(
  fs.readFileSync(currentWindow.custom.path, "utf8")
);

let hasMoved = false;

setInterval(() => {
  if (hasMoved) {
    hasMoved = false;
    editor.trigger("process");
  }
}, 1000);

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

    editor.on("nodetranslated", () => {
      hasMoved = true;
    });

    editor.on(
      "process connectionremoved nodecreated noderemoved",
      async function() {
        if (engine.silent) return;
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
            fs.writeFileSync(
              currentWindow.custom.path,
              JSON.stringify(materialConfig, null, 2),
              "utf8"
            );
          }
        );
        uVars.clear();
        pluginsIncluded = [];
      }
    );

    editor.on("connectioncreated", connection => {
      editor.trigger("process");
    });

    editor.trigger("process");
    editor.view.resize();
    AreaPlugin.zoomAt(editor);
    setTimeout(() => {
      refreshNodes();
    }, 500);
  });
