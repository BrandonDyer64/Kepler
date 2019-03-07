const electron = require("electron");
const fs = require("fs");
const path = require("path");
const remote = electron.remote;
const mainProcess = remote.require("./main");
projectDirectory = mainProcess.projectDirectory.dir;
console.log(projectDirectory);
content = fs.readdirSync(projectDirectory);
console.log(content);
function loadAssetViewer(dir) {
  assetFiles = fs.readdirSync(projectDirectory + dir);
  let parentDir = path
    .dirname(dir)
    .split(path.sep)
    .pop();
  if (parentDir != "" && parentDir[0] != "/") {
    parentDir = "/" + parentDir;
  }

  $("#assets_panel").html(
    (dir != ""
      ? `
<div class="asset">
  <a href="Javascript:assetClick('dir','${parentDir}');" class="btn btn-icon"><i class="octicon octicon-chevron-left"></i><br><div></div></a>
</div>
`
      : "") +
      `
<div class="asset">
  <a href="Javascript:assetClick('new','${dir}');" class="btn btn-icon"><i class="octicon octicon-plus"></i><br><div></div></a>
</div>
<!--<div class="asset">
  <a href="Javascript:assetClick('import','${dir}');" class="btn btn-icon"><i class="octicon octicon-inbox"></i><br><div></div></a>
</div>-->
`
  );
  for (let i in assetFiles) {
    let assetFile = assetFiles[i];
    const assetFileRaw = "/" + dir + "/" + assetFiles[i];
    let type = "dir";
    let assetName = assetFile;
    if (assetFile.includes(".")) {
      if (!assetFile.endsWith(".json")) {
        continue;
      } else {
        assetFile = assetFile.replace(".json", "");
        assetSplit = assetFile.split(".");
        if (assetSplit[1]) {
          type = assetSplit[1];
        } else {
          type = "kepler";
        }
        const asset = require(projectDirectory + assetFileRaw);
        console.log(asset);
        assetName = assetSplit[0];
        console.log(assetName);
        assetFile = assetSplit[0];
      }
    }
    const icon = {
      dir: "octicon octicon-file-directory",
      kepler: "octicon octicon-telescope",
      shader: "ti-brush",
      material: "octicon octicon-paintcan",
      level: "ti-map-alt",
      luaprint: "octicon octicon-circuit-board",
      script: "octicon octicon-file-code",
      cppactor: "octicon octicon-file-code"
    }[type];
    $("#assets_panel").append(`
  <div class="asset">
    <a href="Javascript:assetClick('${type}','${assetFileRaw}');" class="btn btn-icon"><i class="${icon}"></i><br><div>${assetName}</div></a>
  </div>
`);
  }
}
loadAssetViewer("");
function assetClick(type, path) {
  console.log(path);
  switch (type) {
    case "dir":
      loadAssetViewer(path);
      break;
    case "material":
    case "luaprint":
    case "script":
    case "new":
      mainProcess.openAssetEditor(type, projectDirectory + path);
      break;
    default:
      console.log("unknown asset type");
      break;
  }
}
