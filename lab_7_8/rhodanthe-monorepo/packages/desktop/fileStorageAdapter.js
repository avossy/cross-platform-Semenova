import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { JewelryStorageAdapter } from "@rhodanthe/core";

export class FileStorageAdapter extends JewelryStorageAdapter {
  constructor(filePath) {
    super();
    this.filePath = filePath;
  }

  async load() {
    try {
      const data = JSON.parse(await readFile(this.filePath, "utf-8"));
      return Array.isArray(data) ? data : [];
    } catch {
      // якщо файлу ще немає або він пошкоджений, починаємо з порожнього списку
      return [];
    }
  }

  async save(items) {
    await mkdir(dirname(this.filePath), { recursive: true });
    await writeFile(this.filePath, JSON.stringify(items, null, 2), "utf-8");
  }
}
