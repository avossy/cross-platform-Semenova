export class JewelryStorageAdapter {
  // повертає масив усіх збережених виробів
  async load() {
    throw new Error("Метод load() не реалізовано");
  }

  // зберігає масив виробів повністю
  async save(items) {
    throw new Error("Метод save() не реалізовано");
  }
}

// адаптер у пам'яті, потрібен для тестів та прототипів, нічого не пише на диск
export class MemoryStorageAdapter extends JewelryStorageAdapter {
  constructor(initialItems = []) {
    super();
    this.items = [...initialItems];
  }

  async load() {
    return [...this.items];
  }

  async save(items) {
    this.items = [...items];
  }
}
