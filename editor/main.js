// Modules to control application life and create native browser window
const { app, BrowserWindow, dialog } = require("electron");
const path = require("path");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let projectWindow;

function createProjectWindow() {
  // Create the browser window.
  projectWindow = new BrowserWindow({
    width: 800,
    height: 380,
    autoHideMenuBar: true
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
    autoHideMenuBar: true
  });

  // and load the index.html of the app.
  editorWindow.loadFile("editor.html");

  editorWindow.maximize();

  //editorWindow.setMenu(null)

  // Open the DevTools.
  editorWindow.webContents.openDevTools();

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
    path
  };

  // and load the index.html of the app.
  assetEditorWindow.loadFile(`windows/${type}_editor.html`);

  assetEditorWindow.maximize();

  //assetEditorWindow.setMenu(null)

  // Open the DevTools.
  assetEditorWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  assetEditorWindow.on("closed", function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    assetEditorWindow = null;
  });
};

exports.openProjectDialog = callbackFail => {
  dialog.showOpenDialog(
    projectWindow,
    {
      properties: ["openFile"]
    },
    paths => {
      console.log(paths);
      console.log(path.posix.basename(paths[0]));
      if (paths[0] && path.posix.basename(paths[0]) == "kepler.json") {
        projectDirectory.dir = path.posix.dirname(paths[0]);
        createEditorWindow(() => {
          if (projectWindow) {
            projectWindow.close();
          }
        });
      } else {
        callbackFail();
      }
    }
  );
};

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
