const electron = require("electron");
const fs = require("fs");
const path = require("path");
const Rete = require("rete");
const AlightRenderPlugin = require("rete-alight-render-plugin");
const ConnectionPlugin = require("rete-connection-plugin");
const ConnectionPathPlugin = require("rete-connection-path-plugin");
const ContextMenuPlugin = require("rete-context-menu-plugin");
const AreaPlugin = require("rete-area-plugin");
const extraComponents = require(path.resolve("./js/LuaFlow/index.js"));
const {
  FloatInputControl,
  StringInputControl,
  TextInputControl
} = require(path.resolve("./js/LuaFlow/InputControls"));
const { statement, uVars, uniqueVar } = require(path.resolve(
  "./js/LuaFlow/utils.js"
));
const remote = electron.remote;
const mainProcess = remote.require("./main");
const CodePlugin = require(path.resolve("./js/CodePluginLogical"));
const pug = require("pug");
const nodeTemplate = pug.compileFile(path.resolve("./js/nodeTemplate.pug"));
const currentWindow = remote.getCurrentWindow();

var pluginsIncluded = [];

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
var entitySocket = new Rete.Socket("Entity");
var vector2Socket = new Rete.Socket("Vector2");
var vector3Socket = new Rete.Socket("Vector3");
var vector4Socket = new Rete.Socket("Vector4");
var anySocket = new Rete.Socket("Any");

var typeRef = {
  Action: actSocket,
  Boolean: boolSocket,
  Number: floatSocket,
  String: stringSocket,
  Any: anySocket,
  Entity: entitySocket
};

anySocket.combineWith(boolSocket);
anySocket.combineWith(floatSocket);
anySocket.combineWith(vector2Socket);
anySocket.combineWith(vector3Socket);
anySocket.combineWith(vector4Socket);
anySocket.combineWith(stringSocket);
anySocket.combineWith(entitySocket);
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
entitySocket.combineWith(anySocket);

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

class EventComponent extends Rete.Component {
  constructor(eventName, eventParams) {
    super("On " + eventName);
    this.path = ["Events"];
    this.contextMenuName = eventName;
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

class OperatorComponent extends Rete.Component {
  constructor(
    menu,
    socketType,
    name,
    operator,
    inputSocketType = anySocket,
    execable
  ) {
    super(name);
    this.name = name;
    this.operator = operator;
    this.socketType = socketType;
    this.inputSocketType = inputSocketType;
    this.execable = execable;
    this.path = [...["Operators"], ...menu];
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    node.type = "operator";
    node.hideTitle = true;
    node.showCenterTitle = true;
    if (this.execable) node.altName = this.operator + " ";
    else node.altName = this.operator;

    let inA = new Rete.Input("inA", "", this.inputSocketType);
    let inB = new Rete.Input("inB", "", this.inputSocketType);
    let out = new Rete.Output("value", "", this.socketType);

    if (this.execable) {
      const { execIn, execOut } = createExecs();
      node.addInput(execIn);
      node.addOutput(execOut);
    } else {
      node.addOutput(out);
    }

    return node.addInput(inA).addInput(inB);
  }

  code(node, inputs, add, outputs) {
    if (this.execable) {
      statement(
        node,
        add,
        inputs,
        outputs,
        `${inputs.inA} = ${inputs.inA} ${this.operator[0]} ${inputs.inB}`
      );
    } else {
      outputs.value = `(${inputs.inA} ${this.operator} ${inputs.inB})`;
    }
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

const bS = boolSocket,
  fS = floatSocket,
  aS = anySocket;

var components = [
  new PrintComponent(),
  new EventComponent("Tick", [{ name: "delta", socket: floatSocket }]),
  new EventComponent("Collide", [{ name: "other", socket: entitySocket }]),
  new EventComponent("Create", []),
  new OperatorComponent(["Compare"], bS, "Equals", "=="),
  new OperatorComponent(["Compare"], bS, "Not Equal", "~="),
  new OperatorComponent(["Compare"], bS, "Greater Than", ">"),
  new OperatorComponent(["Compare"], bS, "Less Than", "<"),
  new OperatorComponent(["Compare"], bS, "Greater or Equal", ">="),
  new OperatorComponent(["Compare"], bS, "Less or Equal", "<="),
  new OperatorComponent(["Math"], fS, "Add", "+", fS),
  new OperatorComponent(["Math"], fS, "Subtract", "-", fS),
  new OperatorComponent(["Math"], fS, "Multiply", "*", fS),
  new OperatorComponent(["Math"], fS, "Divide", "/", fS),
  new OperatorComponent(["Math"], fS, "Modulo", "%", fS),
  new OperatorComponent(["Logical"], bS, "And", "and", bS),
  new OperatorComponent(["Logical"], bS, "Or", "or", bS),
  new OperatorComponent(["Assignment"], bS, "Equal", "=", aS, true),
  new OperatorComponent(["Assignment"], bS, "PlusEquals", "+=", aS, true),
  new OperatorComponent(["Assignment"], bS, "MinusEquals", "-=", aS, true),
  new OperatorComponent(["Assignment"], bS, "TimesEquals", "*=", aS, true),
  new OperatorComponent(["Assignment"], bS, "DivideEquals", "/=", aS, true),
  new OperatorComponent(["Assignment"], bS, "ModEquals", "%=", aS, true)
];

components = components.concat(extraComponents);

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
editor.use(ConnectionPlugin);
editor.use(ConnectionPathPlugin, {
  options: { curvature: 0.4 },
  transformer: () => ([x1, y1, x2, y2]) => {
    const difX = Math.abs(x2 - x1);
    const difY = Math.abs(y2 - y1);
    if (difX < difY || difX > difY * 40) {
      return [[x1, y1], [x2, y2]];
    }
    const midX = (x1 + x2) / 2;
    return [
      [x1, y1],
      [midX - difY / 2, y1],
      [midX - difY / 2, y1],
      [midX - difY / 2, y1],
      [midX + difY / 2, y2],
      [midX + difY / 2, y2],
      [midX + difY / 2, y2],
      [x2, y2]
    ];
  }
});
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
        console.log(
          currentWindow.custom.path.replace(".luaprint.json", ".lua")
        );
        CodePlugin.generate(engine, editor.toJSON()).then(
          ({ file: sourceCode, imports }) => {
            //sourceCode = formatCode(sourceCode);
            fs.writeFileSync(
              currentWindow.custom.path.replace(".luaprint.json", ".lua"),
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
