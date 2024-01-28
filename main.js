// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
// const path = require("node:path");

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    kiosk: true,
    frame: false,
  });

  // and load the index.html of the app.
  mainWindow.loadFile("app/index.html");

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
