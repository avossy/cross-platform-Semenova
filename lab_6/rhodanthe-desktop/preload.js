const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("jewelryAPI", {
    loadJewelry: () => ipcRenderer.invoke("jewelry:load"),
    saveJewelry: (item) => ipcRenderer.invoke("jewelry:save", item),
});