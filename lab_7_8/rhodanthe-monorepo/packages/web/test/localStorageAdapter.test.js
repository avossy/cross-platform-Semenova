import { test } from "node:test";
import assert from "node:assert/strict";
import { JewelryService } from "@rhodanthe/core";
import { LocalStorageAdapter, STORAGE_KEY } from "../localStorageAdapter.js";

// імітація localStorage: у Node.js його немає, тому підставляємо простий об'єкт
function createFakeStorage(initial = {}) {
  const data = { ...initial };
  return {
    data,
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => {
      data[key] = String(value);
    },
  };
}

test("load повертає порожній масив, якщо сховище порожнє", async () => {
  const adapter = new LocalStorageAdapter(createFakeStorage());
  assert.deepEqual(await adapter.load(), []);
});

test("save записує JSON, а load читає його назад", async () => {
  const storage = createFakeStorage();
  const adapter = new LocalStorageAdapter(storage);
  const items = [
    { id: 1, name: "Каблучка", price: 12400, material: "Срібло 925", gemstone: "Діамант", weight: 3.5 },
  ];

  await adapter.save(items);

  assert.equal(storage.data[STORAGE_KEY], JSON.stringify(items));
  assert.deepEqual(await adapter.load(), items);
});

test("load повертає [] для пошкодженого JSON та для не-масиву", async () => {
  const broken = new LocalStorageAdapter(createFakeStorage({ [STORAGE_KEY]: "{не json" }));
  const notArray = new LocalStorageAdapter(createFakeStorage({ [STORAGE_KEY]: '{"a":1}' }));

  assert.deepEqual(await broken.load(), []);
  assert.deepEqual(await notArray.load(), []);
});

test("адаптер працює зі спільним JewelryService", async () => {
  const service = new JewelryService(new LocalStorageAdapter(createFakeStorage()));

  const added = await service.add({
    name: "  Перевірити адаптер  ",
    price: "1500",
    material: "Срібло 925",
    gemstone: "Рубін",
    weight: "2.5",
  });
  assert.equal(added.ok, true);
  assert.equal((await service.list()).length, 1);

  const favorite = await service.toggleFavorite(added.item.id);
  assert.equal(favorite.ok, true);
  assert.equal((await service.listFavorites()).length, 1);

  const removed = await service.remove(added.item.id);
  assert.equal(removed.ok, true);
  assert.deepEqual(await service.list(), []);
});