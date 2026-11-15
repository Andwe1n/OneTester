const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("oneTesterDesktop", {
  connect: (options) => ipcRenderer.invoke("robot:connect", options),
  call: (path, body) => ipcRenderer.invoke("robot:call", path, body),
  disconnect: () => ipcRenderer.invoke("robot:disconnect"),
  saveBridge: () => ipcRenderer.invoke("files:bridge"),
  platform: process.platform,
});
