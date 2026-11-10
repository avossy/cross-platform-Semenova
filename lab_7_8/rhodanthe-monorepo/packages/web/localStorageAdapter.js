import { JewelryStorageAdapter } from "@rhodanthe/core";

export const STORAGE_KEY = "rhodanthe";

export class LocalStorageAdapter extends JewelryStorageAdapter {
  constructor(storage = globalThis.localStorage, key = STORAGE_KEY) {
    super();
    this.storage = storage;
    this.key = key;
  }

  async load() {
    const raw = this.storage.getItem(this.key);

    if (raw === null) {
      return [];
    }

    try {
      const data = JSON.parse(raw);
      return Array.isArray(data) ? data : [];
    } catch {
      // Пошкоджений JSON не повинен ламати застосунок
      return [];
    }
  }

  async save(items) {
    this.storage.setItem(this.key, JSON.stringify(items));
  }
}
