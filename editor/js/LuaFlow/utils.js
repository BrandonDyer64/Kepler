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
  if (varname) varname = `_${varname}`;
  else varname = "_";
  let varnum = 1;
  if (uVars.has(varname)) varnum = uVars.get(varname);
  else uVars.set(varname, varnum);
  uVars.set(varname, varnum + 1);
  var text = "ku" + varname + (varnum == 1 ? "" : "_" + varnum);

  return text;
}

module.exports = { statement, uVars, uniqueVar };
