const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("jewelryAPI", {
  list: (query) => ipcRenderer.invoke("jewelry:list", query),
  listFavorites: () => ipcRenderer.invoke("jewelry:favorites"),
  add: (data) => ipcRenderer.invoke("jewelry:add", data),
  remove: (id) => ipcRenderer.invoke("jewelry:remove", id),
  toggleFavorite: (id) => ipcRenderer.invoke("jewelry:toggle-favorite", id),
});
