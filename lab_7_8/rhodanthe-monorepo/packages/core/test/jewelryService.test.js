import { test } from "node:test";
import assert from "node:assert/strict";
import { JewelryService } from "../jewelryService.js";
import { MemoryStorageAdapter, JewelryStorageAdapter } from "../storageAdapter.js";
import { ERROR_NAME_EMPTY, ERROR_PRICE } from "../jewelryValidation.js";

const ringData = { name: "Каблучка «Аврора»", price: "12400", material: "Срібло 925", gemstone: "Діамант", weight: "3.5", size: "17", description: "" };
const earringsData = { name: "Сережки «Ніжність»", price: "3200", material: "Срібло 925", gemstone: "Перли", weight: "2", size: "", description: "" };
const braceletData = { name: "Браслет «Крапля роси»", price: "8750", material: "Золото 585", gemstone: "Без каменю", weight: "7", size: "", description: "" };

// Годинник, який щоразу рухається на секунду вперед, щоб вироби мали різні дати
function createClock(start = Date.UTC(2026, 10, 3, 10, 0, 0)) {
  let time = start;
  return () => new Date((time += 1000));
}

test("add зберігає виріб і повертає його", async () => {
  const adapter = new MemoryStorageAdapter();
  const service = new JewelryService(adapter, { now: createClock() });

  const result = await service.add(ringData);

  assert.equal(result.ok, true);
  assert.equal(result.item.name, "Каблучка «Аврора»");
  assert.equal(result.item.price, 12400);
  assert.equal(result.item.favorite, false);
  assert.equal(adapter.items.length, 1);
});

test("add відхиляє некоректні дані й нічого не зберігає", async () => {
  const adapter = new MemoryStorageAdapter();
  const service = new JewelryService(adapter);

  assert.deepEqual(await service.add({ ...ringData, name: "   " }), { ok: false, error: ERROR_NAME_EMPTY });
  assert.deepEqual(await service.add({ ...ringData, price: "0" }), { ok: false, error: ERROR_PRICE });
  assert.equal(adapter.items.length, 0);
});

test("id виробів унікальні, навіть якщо їх додано в одну мілісекунду", async () => {
  const fixed = new Date("2026-11-03T10:00:00.000Z");
  const service = new JewelryService(new MemoryStorageAdapter(), { now: () => fixed });

  const first = await service.add(ringData);
  const second = await service.add(earringsData);
  const third = await service.add(braceletData);

  assert.equal(new Set([first.item.id, second.item.id, third.item.id]).size, 3);
});

test("list повертає спочатку новіші вироби", async () => {
  const service = new JewelryService(new MemoryStorageAdapter(), { now: createClock() });
  await service.add(ringData);
  await service.add(earringsData);
  await service.add(braceletData);

  const names = (await service.list()).map((item) => item.name);

  assert.deepEqual(names, ["Браслет «Крапля роси»", "Сережки «Ніжність»", "Каблучка «Аврора»"]);
});

test("list(query) шукає за назвою, матеріалом і каменем", async () => {
  const service = new JewelryService(new MemoryStorageAdapter(), { now: createClock() });
  await service.add(ringData);
  await service.add(earringsData);
  await service.add(braceletData);

  assert.deepEqual((await service.list("аврора")).map((item) => item.name), ["Каблучка «Аврора»"]);
  assert.equal((await service.list("срібло")).length, 2);
  assert.equal((await service.list("золото")).length, 1);
  assert.equal((await service.list("перли")).length, 1);
  assert.equal((await service.list("немає такого")).length, 0);
  assert.equal((await service.list("  ")).length, 3);
});

test("remove видаляє наявний виріб", async () => {
  const service = new JewelryService(new MemoryStorageAdapter(), { now: createClock() });
  const { item } = await service.add(ringData);
  await service.add(earringsData);

  assert.deepEqual(await service.remove(item.id), { ok: true });
  assert.deepEqual((await service.list()).map((entry) => entry.name), ["Сережки «Ніжність»"]);
});

test("remove повідомляє, якщо виробу немає", async () => {
  const service = new JewelryService(new MemoryStorageAdapter());

  assert.deepEqual(await service.remove(12345), { ok: false, error: "Виріб не знайдено." });
});

test("toggleFavorite додає виріб в обране і прибирає з нього", async () => {
  const adapter = new MemoryStorageAdapter();
  const service = new JewelryService(adapter, { now: createClock() });
  const { item } = await service.add(ringData);

  const added = await service.toggleFavorite(item.id);
  assert.equal(added.ok, true);
  assert.equal(added.item.favorite, true);
  assert.equal(adapter.items[0].favorite, true);

  const removed = await service.toggleFavorite(item.id);
  assert.equal(removed.item.favorite, false);
  assert.equal((await service.listFavorites()).length, 0);
});

test("toggleFavorite повідомляє, якщо виробу немає", async () => {
  const service = new JewelryService(new MemoryStorageAdapter());

  assert.deepEqual(await service.toggleFavorite(999), { ok: false, error: "Виріб не знайдено." });
});

test("listFavorites повертає лише обрані вироби, спочатку новіші", async () => {
  const service = new JewelryService(new MemoryStorageAdapter(), { now: createClock() });
  const ring = (await service.add(ringData)).item;
  await service.add(earringsData);
  const bracelet = (await service.add(braceletData)).item;

  await service.toggleFavorite(ring.id);
  await service.toggleFavorite(bracelet.id);

  assert.deepEqual((await service.listFavorites()).map((item) => item.name), ["Браслет «Крапля роси»", "Каблучка «Аврора»"]);
});

test("видалений виріб зникає і з обраного", async () => {
  const service = new JewelryService(new MemoryStorageAdapter(), { now: createClock() });
  const { item } = await service.add(ringData);
  await service.toggleFavorite(item.id);

  await service.remove(item.id);

  assert.equal((await service.listFavorites()).length, 0);
  assert.equal((await service.list()).length, 0);
});

test("сервіс ігнорує пошкоджені записи й підтримує старі записи без favorite та createdAt", async () => {
  const oldItem = { id: 100, name: "Старий виріб", price: 500, material: "Срібло 925", gemstone: "Рубін", weight: 1.5 };
  const adapter = new MemoryStorageAdapter([oldItem, null, { id: "x" }, "сміття"]);
  const service = new JewelryService(adapter, { now: createClock() });

  assert.deepEqual(await service.list(), [oldItem]);

  const result = await service.toggleFavorite(100);
  assert.equal(result.item.favorite, true);
});

test("базовий адаптер без реалізації викидає помилку", async () => {
  const adapter = new JewelryStorageAdapter();

  await assert.rejects(() => adapter.load(), /не реалізовано/);
  await assert.rejects(() => adapter.save([]), /не реалізовано/);
});
