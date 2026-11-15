const { app, BrowserWindow, dialog, ipcMain, session, shell } = require("electron");
const path = require("node:path");
const fs = require("node:fs/promises");
const { pathToFileURL } = require("node:url");
const { RobotTransport } = require("./transport.cjs");
const transport = new RobotTransport();
const entry = path.join(__dirname, "..", "index.html");
let window;
let closing = false;

function trusted(event) {
  if (
    event.senderFrame !== window.webContents.mainFrame ||
    event.senderFrame.url !== pathToFileURL(entry).href
  ) {
    throw new Error("Untrusted application frame.");
  }
}

app.whenReady().then(() => {
  session.defaultSession.setPermissionRequestHandler((_contents, _permission, callback) =>
    callback(false),
  );
  session.defaultSession.setPermissionCheckHandler(() => false);
  ipcMain.handle("robot:connect", (event, options) => {
    trusted(event);
    return transport.connect(options);
  });
  ipcMain.handle("robot:call", (event, route, body) => {
    trusted(event);
    return transport.call(route, body);
  });
  ipcMain.handle("robot:disconnect", (event) => {
    trusted(event);
    return transport.disconnect();
  });
  ipcMain.handle("files:bridge", async (event) => {
    trusted(event);
    const result = await dialog.showOpenDialog(window, {
      title: "Save the FTC bridge and setup guide",
      properties: ["openDirectory", "createDirectory"],
    });
    if (result.canceled) return false;
    const folder = await fs.mkdtemp(path.join(result.filePaths[0], "OneTester-Integration-"));
    for (const [source, name] of [
      ["OneTesterBridge.java", "OneTesterBridge.java"],
      ["README.md", "OneTester-Setup.md"],
    ]) {
      await fs.copyFile(
        path.join(__dirname, "..", "robot", source),
        path.join(folder, name),
        fs.constants.COPYFILE_EXCL,
      );
    }
    await shell.openPath(folder);
    return folder;
  });
  window = new BrowserWindow({
    title: "OneTester",
    width: 1440,
    height: 940,
    minWidth: 900,
    minHeight: 660,
    backgroundColor: "#111314",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  window.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  window.webContents.on("will-navigate", (event) => event.preventDefault());
  window.webContents.on("render-process-gone", () => {
    transport.disconnect().catch(() => {});
  });
  window.on("close", (event) => {
    if (closing) return;
    event.preventDefault();
    closing = true;
    transport
      .disconnect()
      .catch(() => {})
      .finally(() => app.quit());
  });
  window.loadFile(entry);
});
app.on("window-all-closed", () => app.quit());
