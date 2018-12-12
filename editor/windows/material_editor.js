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
const CodePlugin = require(path.resolve("./js/CodePluginGLSL"));
const currentWindow = remote.getCurrentWindow();

var botAvatar =
  "https://robohash.org/liberovelitdolores.bmp?size=50x50&set=set1";
var userAvatar =
  "http://icons.iconarchive.com/icons/visualpharm/must-have/256/User-icon.png";

var onMessageTask = null;
function receiveBot(msg) {
  setTimeout(async () => {
    await onMessageTask.run(msg);
  }, telegram.botSleep);
}

function receiveUser(msg) {
  telegram.sendBot(msg);
}

var actSocket = new Rete.Socket("Action");
var strSocket = new Rete.Socket("String");
var boolSocket = new Rete.Socket("Boolean");
var floatSocket = new Rete.Socket("Float");
var vector2Socket = new Rete.Socket("Vector2");
var vector3Socket = new Rete.Socket("Vector3");
var vector4Socket = new Rete.Socket("Vector4");
var anySocket = new Rete.Socket("Any");

anySocket.combineWith(boolSocket);
anySocket.combineWith(floatSocket);
anySocket.combineWith(vector2Socket);
anySocket.combineWith(vector3Socket);
anySocket.combineWith(vector4Socket);
boolSocket.combineWith(anySocket);
floatSocket.combineWith(anySocket);
floatSocket.combineWith(vector2Socket);
floatSocket.combineWith(vector3Socket);
floatSocket.combineWith(vector4Socket);
vector2Socket.combineWith(anySocket);
vector2Socket.combineWith(vector3Socket);
vector2Socket.combineWith(vector4Socket);
vector3Socket.combineWith(anySocket);
vector3Socket.combineWith(vector4Socket);
vector4Socket.combineWith(anySocket);

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

class MaterialOutputComponent extends Rete.Component {
  constructor() {
    super("Material Output");
    this.task = {
      outputs: {}
    };
  }

  builder(node) {
    var inp1 = new Rete.Input("color", "Color", vector3Socket);
    var inp2 = new Rete.Input("metallic", "Metallic", floatSocket);
    var inp3 = new Rete.Input("specular", "Specular", floatSocket);
    var inp4 = new Rete.Input("roughness", "Roughness", floatSocket);
    var inp5 = new Rete.Input("opacity", "Opacity", floatSocket);
    var inp6 = new Rete.Input("normal", "Normal", vector3Socket);
    var inp7 = new Rete.Input(
      "subsurface_color",
      "Subsurface Color",
      vector3Socket
    );
    var inp8 = new Rete.Input(
      "subsurface_amount",
      "Subsurface Amount",
      floatSocket
    );
    var inp9 = new Rete.Input("ior", "IOR", floatSocket);
    var inp10 = new Rete.Input(
      "pixel_depth",
      "Pixel Depth Offset",
      floatSocket
    );
    var inp11 = new Rete.Input("parallax_depth", "Parallax Depth", floatSocket);
    var inp12 = new Rete.Input("bump_depth", "Bump Depth", floatSocket);
    var inp13 = new Rete.Input(
      "parallax_overlap",
      "Parallax Overlap",
      boolSocket
    );

    //var ctrl = new FloatInputControl("text");
    //inp2.addControl(ctrl);

    return node
      .addInput(inp1)
      .addInput(inp2)
      .addInput(inp3)
      .addInput(inp4)
      .addInput(inp5)
      .addInput(inp6)
      .addInput(inp7)
      .addInput(inp8)
      .addInput(inp9)
      .addInput(inp10)
      .addInput(inp11)
      .addInput(inp13)
      .addInput(inp12);
  }

  code(node, inputs, add) {
    add(`
        /* #### OUTPUT #### */
        ${JSON.stringify(inputs)}
        /* #### OUTPUT #### */
    `);
  }
}

class TexCoordComponent extends Rete.Component {
  constructor() {
    super("TexCoord");
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    var out = new Rete.Output("coords", "", vector2Socket);

    return node.addOutput(out);
  }

  code(node, inputs, add) {
    add("vec3", "coords", "vec3(texCoord,0)");
  }
}

class ParallaxDepthComponent extends Rete.Component {
  constructor() {
    super("Parallax Depth");
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    var out = new Rete.Output("depth", "", floatSocket);

    return node.addOutput(out);
  }

  code(node, inputs, add) {
    add("float", "depth", "depth");
  }
}

class TimeComponent extends Rete.Component {
  constructor() {
    super("Time");
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    var out = new Rete.Output("time", "", floatSocket);

    return node.addOutput(out);
  }

  code(node, inputs, add) {
    add("float", "time", "u_time");
  }
}

class ViewVectorComponent extends Rete.Component {
  constructor() {
    super("View Vector");
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    var out = new Rete.Output("vector", "", vector2Socket);

    return node.addOutput(out);
  }

  code(node, inputs, add) {
    add("vec3", "vector", "vec3(viewVector,0)");
  }
}

class InvertComponent extends Rete.Component {
  constructor() {
    super("Invert");
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    var inp = new Rete.Input("color", "", anySocket);
    var out = new Rete.Output("inverted", "", anySocket);

    return node.addInput(inp).addOutput(out);
  }

  code(node, inputs, add) {
    console.log(inputs);
    add(anyify(inputs.color), "inverted", `1.0 - ${inputs.color}`);
  }
}

class DivideComponent extends Rete.Component {
  constructor() {
    super("Divide");
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    var inp0 = new Rete.Input("in0", "", anySocket);
    var inp1 = new Rete.Input("in1", "", anySocket);
    var out = new Rete.Output("divided", "", anySocket);

    return node
      .addInput(inp0)
      .addInput(inp1)
      .addOutput(out);
  }

  code(node, inputs, add) {
    add(anyify(inputs.in0), "divided", `${inputs.in0} / ${inputs.in1}`);
  }
}

class MultiplyComponent extends Rete.Component {
  constructor() {
    super("Multiply");
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    var inp0 = new Rete.Input("in0", "", anySocket);
    var inp1 = new Rete.Input("in1", "", anySocket);
    var out = new Rete.Output("product", "", anySocket);

    return node
      .addInput(inp0)
      .addInput(inp1)
      .addOutput(out);
  }

  code(node, inputs, add) {
    add(anyify(inputs.in0), "product", `${inputs.in0} * ${inputs.in1}`);
  }
}

class AddComponent extends Rete.Component {
  constructor() {
    super("Add");
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    var inp0 = new Rete.Input("in0", "", anySocket);
    var inp1 = new Rete.Input("in1", "", anySocket);
    var out = new Rete.Output("sum", "", anySocket);

    return node
      .addInput(inp0)
      .addInput(inp1)
      .addOutput(out);
  }

  code(node, inputs, add) {
    add(anyify(inputs.in0), "sum", `${inputs.in0} + ${inputs.in1}`);
  }
}

class SubtractComponent extends Rete.Component {
  constructor() {
    super("Subtract");
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    var inp0 = new Rete.Input("in0", "", anySocket);
    var inp1 = new Rete.Input("in1", "", anySocket);
    var out = new Rete.Output("difference", "", anySocket);

    return node
      .addInput(inp0)
      .addInput(inp1)
      .addOutput(out);
  }

  code(node, inputs, add) {
    add(anyify(inputs.in0), "difference", `${inputs.in0} - ${inputs.in1}`);
  }
}

class SinComponent extends Rete.Component {
  constructor() {
    super("Sin");
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    var inp0 = new Rete.Input("in0", "", anySocket);
    var out = new Rete.Output("sin", "", anySocket);

    return node.addInput(inp0).addOutput(out);
  }

  code(node, inputs, add) {
    add(anyify(inputs.in0), "sin", `sin(${inputs.in0})`);
  }
}

class PowerComponent extends Rete.Component {
  constructor() {
    super("Power");
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    var inp0 = new Rete.Input("in0", "X", anySocket);
    var inp1 = new Rete.Input("in1", "Exponent", floatSocket);
    var out = new Rete.Output("product", "", anySocket);

    return node
      .addInput(inp0)
      .addInput(inp1)
      .addOutput(out);
  }

  code(node, inputs, add) {
    add(
      anyify(inputs.in0),
      "product",
      `pow(${inputs.in0}, ${anyify(inputs.in0)}(${inputs.in1}))`
    );
  }
}

class SigmoidComponent extends Rete.Component {
  constructor() {
    super("Sigmoid");
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    var inp0 = new Rete.Input("in0", "X", floatSocket);
    var out = new Rete.Output("out", "", floatSocket);

    return node.addInput(inp0).addOutput(out);
  }

  code(node, inputs, add, outputs, imports) {
    if (!imports.includes("sigmoid")) {
      imports.push("sigmoid");
    }
    add("float", "out", `sigmoid(${inputs.in0})`);
  }
}

class FloatComponent extends Rete.Component {
  constructor() {
    super("Float");
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    var out = new Rete.Output("num", "", floatSocket);

    return node.addControl(new FloatInputControl("num")).addOutput(out);
  }

  code(node, inputs, add) {
    add("float", "num", node.data.num);
  }
}

class IfComponent extends Rete.Component {
  constructor() {
    super("If");
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    var a = new Rete.Input("a", "A", floatSocket);
    var b = new Rete.Input("b", "B", floatSocket);
    var g = new Rete.Input("g", ">", anySocket);
    var e = new Rete.Input("e", "=", anySocket);
    var l = new Rete.Input("l", "<", anySocket);
    var out = new Rete.Output("out", "", anySocket);

    return node
      .addInput(a)
      .addInput(b)
      .addInput(g)
      .addInput(e)
      .addInput(l)
      .addOutput(out);
  }

  code(node, inputs, add, outputs) {
    add(anyify(inputs.g), "out");
    add(`
      if (${inputs.a} > ${inputs.b}) {
        ${outputs.out} = ${inputs.g};
      } else if (${inputs.a} == ${inputs.b}) {
        ${outputs.out} = ${inputs.e};
      } else if (${inputs.a} < ${inputs.b}) {
        ${outputs.out} = ${inputs.l};
      }
    `);
  }
}

class IfBoolComponent extends Rete.Component {
  constructor() {
    super("If Boolean");
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    var a = new Rete.Input("a", "", boolSocket);
    var t = new Rete.Input("t", "True", anySocket);
    var f = new Rete.Input("f", "False", anySocket);
    var out = new Rete.Output("out", "", anySocket);

    return node
      .addInput(a)
      .addInput(t)
      .addInput(f)
      .addOutput(out);
  }

  code(node, inputs, add, outputs) {
    add(anyify(inputs.t), "out");
    add(`
      if (${inputs.a}) {
        ${outputs.out} = ${inputs.t};
      } else {
        ${outputs.out} = ${inputs.f};
      }
    `);
  }
}

class CompareComponent extends Rete.Component {
  constructor() {
    super("Compare");
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    var a = new Rete.Input("a", "A", anySocket);
    var b = new Rete.Input("b", "B", anySocket);
    var g = new Rete.Output("g", ">", boolSocket);
    var e = new Rete.Output("e", "=", boolSocket);
    var l = new Rete.Output("l", "<", boolSocket);

    return node
      .addInput(a)
      .addInput(b)
      .addOutput(g)
      .addOutput(e)
      .addOutput(l);
  }

  code(node, inputs, add, outputs) {
    add("bool", "g", `${inputs.a} > ${inputs.b}`);
    add("bool", "e", `${inputs.a} == ${inputs.b}`);
    add("bool", "l", `${inputs.a} < ${inputs.b}`);
  }
}

class BreakVec2Component extends Rete.Component {
  constructor() {
    super("Break Vec2");
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    var in0 = new Rete.Input("vec2", "XY", vector3Socket);
    var out0 = new Rete.Output("x", "X", floatSocket);
    var out1 = new Rete.Output("y", "Y", floatSocket);

    return node
      .addInput(in0)
      .addOutput(out0)
      .addOutput(out1);
  }

  code(node, inputs, add) {
    add("float", "x", `${inputs.vec2}.x`);
    add("float", "y", `${inputs.vec2}.y`);
  }
}

class FloatifyComponent extends Rete.Component {
  constructor() {
    super("Floatify");
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    var in0 = new Rete.Input("vec2", "", vector4Socket);
    var out0 = new Rete.Output("x", "", floatSocket);

    return node.addInput(in0).addOutput(out0);
  }

  code(node, inputs, add) {
    add("float", "x", `${inputs.vec2}.x`);
  }
}

class MakeVec3Component extends Rete.Component {
  constructor() {
    super("Make Vec3");
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    var in0 = new Rete.Input("x", "X", floatSocket);
    var in1 = new Rete.Input("y", "Y", floatSocket);
    var in2 = new Rete.Input("z", "Z", floatSocket);
    var out0 = new Rete.Output("xyz", "XYZ", vector3Socket);

    return node
      .addInput(in0)
      .addInput(in1)
      .addInput(in2)
      .addOutput(out0);
  }

  code(node, inputs, add) {
    add("vec3", "xyz", `vec3(${inputs.x}, ${inputs.y}, ${inputs.z})`);
  }
}

class BalanceComponent extends Rete.Component {
  constructor() {
    super("Balance");
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    var inp0 = new Rete.Input("in0", "", anySocket);
    var out = new Rete.Output("balanced", "", anySocket);

    return node.addInput(inp0).addOutput(out);
  }

  code(node, inputs, add) {
    add(anyify(inputs.in0), "balanced", `${inputs.in0} * 2.0 - 1.0`);
  }
}

class UnbalanceComponent extends Rete.Component {
  constructor() {
    super("Unbalance");
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    var inp0 = new Rete.Input("in0", "", anySocket);
    var out = new Rete.Output("unbalanced", "", anySocket);

    return node.addInput(inp0).addOutput(out);
  }

  code(node, inputs, add) {
    add(anyify(inputs.in0), "unbalanced", `${inputs.in0} / 2.0 + 0.5`);
  }
}

class LerpComponent extends Rete.Component {
  constructor() {
    super("Lerp");
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    var in0 = new Rete.Input("a", "A", vector3Socket);
    var in1 = new Rete.Input("b", "B", vector3Socket);
    var in2 = new Rete.Input("alpha", "Alpha", floatSocket);
    var out0 = new Rete.Output("out", "", vector3Socket);

    return node
      .addInput(in0)
      .addInput(in1)
      .addInput(in2)
      .addOutput(out0);
  }

  code(node, inputs, add) {
    add("vec3", "out", `mix(${inputs.a}, ${inputs.b}, ${inputs.alpha})`);
  }
}

class VectorizeComponent extends Rete.Component {
  constructor() {
    super("Vectorize");
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    var in0 = new Rete.Input("x", "", floatSocket);
    var out0 = new Rete.Output("xyz", "", vector3Socket);

    return node.addInput(in0).addOutput(out0);
  }

  code(node, inputs, add) {
    add("vec3", "xyz", `vec3(${inputs.x})`);
  }
}

class NoiseComponent extends Rete.Component {
  constructor() {
    super("Noise");
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    var in0 = new Rete.Input("position", "Position", vector3Socket);
    var in1 = new Rete.Input("depth", "Depth", floatSocket);
    var out0 = new Rete.Output("out", "", floatSocket);

    return node
      .addInput(in0)
      .addInput(in1)
      .addOutput(out0);
  }

  code(node, inputs, add, outputs, imports) {
    if (!imports.includes("noise")) {
      imports.push("noise");
    }
    const depth = inputs.depth[0] || "3.0";
    add("float", "out", `noise(${inputs.position},${depth})`);
  }
}

class DitherComponent extends Rete.Component {
  constructor() {
    super("Dither");
    this.task = {
      outputs: { text: "output" }
    };
  }

  builder(node) {
    var out0 = new Rete.Output("out", "", boolSocket);

    return node.addOutput(out0);
  }

  code(node, inputs, add, outputs, imports) {
    add(
      "bool",
      "out",
      `mod(floor(gl_FragCoord.x) + floor(gl_FragCoord.y),2.0) == 0.0`
    );
  }
}

var components = [
  new TexCoordComponent(),
  new FloatComponent(),
  new AddComponent(),
  new SubtractComponent(),
  new MultiplyComponent(),
  new DivideComponent(),
  new SinComponent(),
  new PowerComponent(),
  new IfComponent(),
  new IfBoolComponent(),
  new CompareComponent(),
  new VectorizeComponent(),
  new FloatifyComponent(),
  new LerpComponent(),
  new SigmoidComponent(),
  new InvertComponent(),
  new BreakVec2Component(),
  new MakeVec3Component(),
  new TimeComponent(),
  new BalanceComponent(),
  new UnbalanceComponent(),
  new ViewVectorComponent(),
  new NoiseComponent(),
  new ParallaxDepthComponent(),
  new DitherComponent(),
  new MaterialOutputComponent()
];

var container = document.getElementById("editor");
var editor = new Rete.NodeEditor("demo@0.1.0", container);
editor.use(AlightRenderPlugin);
editor.use(ConnectionPlugin);
editor.use(ContextMenuPlugin);
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

function editorSave() {
  const editorJSON = editor.toJSON();
  materialConfig.props.nodes = editorJSON.nodes;
  materialConfig.props.groups = editorJSON.groups;
  CodePlugin.generate(engine, editor.toJSON()).then(
    ({ file: sourceCode, imports }) => {
      sourceCode = sourceCode.split("/* #### OUTPUT #### */");
      output = sourceCode[1];
      sourceCode = sourceCode[0];
      output = JSON.parse(output);
      let file = "";
      if (output.color) {
        file += `
        void main() {
          ${sourceCode}
          gl_FragColor = vec4(${output.color},0);
        }
      `;
      }
      file = file.replace(/ +(?= )/g, "");
      file = file.replace(/\n+(?=\n)/g, "");
      file = file.replace(/\n /g, "\n");
      fs.writeFileSync(
        currentWindow.custom.path.split(".")[0] + ".glsl",
        file,
        "utf8"
      );
      console.log(file);
      fs.writeFileSync(
        currentWindow.custom.path,
        JSON.stringify(materialConfig, null, 2),
        "utf8"
      );
      console.log(materialConfig);
    }
  );
}

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
        CodePlugin.generate(engine, editor.toJSON()).then(
          ({ file: sourceCode, imports }) => {
            sourceCode = sourceCode.split("/* #### OUTPUT #### */");
            output = sourceCode[1];
            sourceCode = sourceCode[0];
            output = JSON.parse(output);
            let atomFile = "";
            for (var i in imports) {
              const imp = imports[i];
              atomFile += fs
                .readFileSync(
                  path.resolve(`./functions/shaders/${imp}.glsl`),
                  "utf8"
                )
                .split("/* #### TEST #### */")[0];
            }
            if (output.parallax_depth.length > 0) {
              atomFile += `
                const int steps = 128;
                const float stepSize = 1.0 / float(steps);
                float getParallaxValue(vec2 offset, float depth) {
                  vec2 texCoord = gl_FragCoord.xy / iResolution.xy - offset;
                  vec2 viewVector = iMouse.xy * 2.0 - 1.0;
                  ${sourceCode}
                  return ${output.parallax_depth};
                }
                void main() {
                  vec2 texCoord = gl_FragCoord.xy / iResolution.xy;
                  vec2 viewVector = iMouse.xy * 2.0 - 1.0;
                  vec2 offset = vec2(0);
                  float depth = 0.0;
                  float heightOld = -1.0;
                  int parallaxPass = 0;
                  int parallaxPasses = mod(floor(gl_FragCoord.x) + floor(gl_FragCoord.y),2.0) == 0.0 ? 1 : 2;

                  for (int i = 1; i <= steps; i++) {
                    depth = float(i) * stepSize;
                    offset = viewVector * depth;
                		float height = 1.0 - getParallaxValue(offset, depth);
                    if (height <= float(i) * stepSize) {
                      parallaxPass++;
                      if (parallaxPass >= parallaxPasses) {
                        break;
                      }
                    }
                  }
                  texCoord -= offset;
                  ${sourceCode}
                  gl_FragColor = vec4(${output.color},0);
                }
              `;
            } else if (output.color) {
              atomFile += `
                void main() {
                  vec2 texCoord = gl_FragCoord.xy / iResolution.xy;
                  vec2 viewVector = iMouse.xy * 2.0 - 1.0;
                  ${sourceCode}
                  gl_FragColor = vec4(${output.color},0);
                }
              `;
            }
            atomFile = atomFile.replace(/ +(?= )/g, "");
            atomFile = atomFile.replace(/\n+(?=\n)/g, "");
            atomFile = atomFile.replace(/\n /g, "\n");
            fs.writeFileSync(
              currentWindow.custom.path.split(".")[0] + ".atom.glsl",
              atomFile,
              "utf8"
            );
          }
        );
      }
    );

    editor.trigger("process");
    editor.view.resize();
    AreaPlugin.zoomAt(editor);
  });
