const { app, BrowserWindow } = require("electron");
if (require('electron-squirrel-startup')) app.quit();
const server = require("./app");
const fs = require("fs");

let mainWindow;
 
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    icon: './icon/icon.png',
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.maximize();
  mainWindow.setMenuBarVisibility(false);
 
  mainWindow.loadURL("http://localhost:12000");
  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}
 
app.on("ready", createWindow);
 
app.on("resize", function (e, x, y) {
  mainWindow.setSize(x, y);
});
 
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
 
app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});