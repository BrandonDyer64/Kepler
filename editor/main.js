// Modules to control application life and create native browser window
const { app, BrowserWindow, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const Git = require("nodegit");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let projectWindow;

function createProjectWindow() {
  // Create the browser window.
  projectWindow = new BrowserWindow({
    width: 800,
    height: 380,
    autoHideMenuBar: true,
    icon: path.join(__dirname, "logo.png")
  });

  // and load the index.html of the app.
  projectWindow.loadFile("index.html");

  //projectWindow.setMenu(null)

  // Open the DevTools.
  // projectWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  projectWindow.on("closed", function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    projectWindow = null;
  });
}

let editorWindow;

function createEditorWindow(callback) {
  // Create the browser window.
  editorWindow = new BrowserWindow({
    width: 1920,
    height: 720,
    autoHideMenuBar: true,
    icon: path.join(__dirname, "logo.png")
  });

  // and load the index.html of the app.
  editorWindow.loadFile("editor.html");

  editorWindow.maximize();

  //editorWindow.setMenu(null)

  // Open the DevTools.
  //editorWindow.webContents.openDevTools();

  editorWindow.on("focus", callback);

  // Emitted when the window is closed.
  editorWindow.on("closed", function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    editorWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createProjectWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (projectWindow === null) {
    createProjectWindow();
  }
});

let projectDirectory = { dir: "" };

exports.projectDirectory = projectDirectory;

function loadFilesOfTypes(dir, extentions) {
  let files = [];
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach((file, index) => {
      var curPath = dir + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        if (!curPath.includes("/.")) {
          files = files.concat(loadFilesOfTypes(curPath, extentions));
        }
      } else if (extentions.includes(path.extname(curPath))) {
        const data = fs.readFileSync(curPath, "utf8");
        files.push({
          extention: path.extname(curPath),
          path: curPath,
          name: file,
          data
        });
      }
    });
  }
  return files;
}

function loadPackageFiles(extentions) {
  let files = {};
  const path = projectDirectory.dir + "/k_packages/";
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((owner, index) => {
      files[owner] = {};
      fs.readdirSync(path + owner).forEach((pkgname, index) => {
        files[owner][pkgname] = loadFilesOfTypes(
          path + owner + "/" + pkgname,
          extentions
        );
      });
    });
  }
  return files;
}

exports.openAssetEditor = (type, path) => {
  let assetEditorWindow;

  // Create the browser window.
  assetEditorWindow = new BrowserWindow({
    width: 1920,
    height: 720,
    autoHideMenuBar: true
  });

  assetEditorWindow.custom = {
    type,
    path,
    projectDir: projectDirectory.dir,
    loadPackageFiles
  };

  // and load the index.html of the app.
  assetEditorWindow.loadFile(`windows/${type}_editor.html`);

  assetEditorWindow.maximize();

  //assetEditorWindow.setMenu(null)

  // Open the DevTools.
  //assetEditorWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  assetEditorWindow.on("closed", function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    assetEditorWindow = null;
  });
};

var deleteFolderRecursive = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

exports.openProjectDialog = (callbackProgress, callbackFail) => {
  // Display file browser
  dialog.showOpenDialog(
    projectWindow,
    {
      properties: ["openFile"]
    },
    paths => {
      console.log(paths);
      console.log(path.basename(paths[0]));
      if (paths[0] && path.basename(paths[0]) == "kepler.json") {
        // Load project
        projectDirectory.dir = path.dirname(paths[0]);
        keplerJson = JSON.parse(fs.readFileSync(paths[0]));
        const promi = [];
        let progress = 0;
        for (let i in keplerJson.packages) {
          const pkg = keplerJson.packages[i];
          promi.push(
            new Promise((resolve, reject) => {
              const pkgdir = projectDirectory.dir + "/k_packages/" + pkg;
              if (fs.existsSync(pkgdir)) {
                // Pull repository
                /*
                // Pull doesn't work
                Git.Repository.open(pkgdir).then(repo => {
                  repo.fetchAll({}).then(() => {
                    console.log("fetched");
                    repo.mergeBranchs("master", "origin/master");
                    console.log("merged");
                    progress++;
                    callbackProgress(progress / keplerJson.packages.length);
                    resolve();
                  });
                });
                */
                // Instead we'll just delete the folder and clone again
                deleteFolderRecursive(pkgdir);
              } /*else {*/
              // Clone repository
              Git.Clone("https://github.com/" + pkg, pkgdir).then(function(
                repository
              ) {
                progress++;
                callbackProgress(progress / keplerJson.packages.length);
                resolve();
              });
              /*}*/
            })
          );
        }
        // Open editor
        Promise.all(promi).then(() => {
          setTimeout(() => {
            createEditorWindow(() => {
              if (projectWindow) {
                projectWindow.close();
              }
            });
          }, 1000);
        });
      } else {
        callbackFail();
      }
    }
  );
};

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
