import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JewelryService } from "@rhodanthe/core";
import { FileStorageAdapter } from "./fileStorageAdapter.js";
import { createHandlers } from "./ipcHandlers.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function createWindow() {
  const win = new BrowserWindow({
    width: 1300,
    height: 760,
    title: "Rhodanthe Desktop",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile(path.join(__dirname, "renderer", "index.html"));
}

app.whenReady().then(() => {
  const adapter = new FileStorageAdapter(path.join(app.getPath("userData"), "jewelry.json"));
  const handlers = createHandlers(new JewelryService(adapter));

  ipcMain.handle("jewelry:list", (event, query) => handlers.list(query));
  ipcMain.handle("jewelry:favorites", () => handlers.listFavorites());
  ipcMain.handle("jewelry:add", (event, data) => handlers.add(data));
  ipcMain.handle("jewelry:remove", (event, id) => handlers.remove(id));
  ipcMain.handle("jewelry:toggle-favorite", (event, id) => handlers.toggleFavorite(id));

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
