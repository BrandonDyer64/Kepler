const electron = require("electron");
const fs = require("fs");
const path = require("path");
const remote = electron.remote;
const mainProcess = remote.require("./main");
const currentWindow = remote.getCurrentWindow();
const assetTypes = require("../js/NewAssetMenus/menus");

const selectorRadios = document.getElementById("SelectorRadios");

for (let i in assetTypes) {
  const assetType = assetTypes[i];
  const radio = document.createElement("div");
  radio.style.padding = "15px 15px";
  radio.style.margin = "3px";
  radio.style.background = "var(--background)";
  radio.style.width = "100%";
  radio.innerHTML = '<input type="radio" name="type" /> ' + assetType.human;
  selectorRadios.appendChild(radio);
}
