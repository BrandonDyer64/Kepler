const { camel } = require("case");

function install(editor, params) {}

function getVarName(node) {
  return camel(`${node.name}${node.id}`);
}

function generate(engine, data) {
  return new Promise(async (resolve, reject) => {
    let file = "";
    let imports = [];

    engine = engine.clone();
    engine.components = engine.components.map(c => {
      c = Object.assign(Object.create(Object.getPrototypeOf(c)), c);

      if (!c.code) {
        return c;
      }

      c.worker = (node, inputs, outputs) => {
        function add(type, name, expression) {
          if (!name) {
            file += `${type}\n`;
            return;
          }

          const varName = `${type}_m_${getVarName(node)}${name}`;

          if (expression) {
            file += `${type} ${varName} = ${expression};\n`;
          } else {
            file += `${type} ${varName};\n`;
          }
          outputs[name] = varName;
        }
        if (c.code) {
          c.code(node, inputs, add, outputs, imports);
        }
      };
      c.worker.bind(c);

      return c;
    });

    await engine.process(data);

    resolve({ file, imports });
  });
}

module.exports = {
  install,
  generate
};
