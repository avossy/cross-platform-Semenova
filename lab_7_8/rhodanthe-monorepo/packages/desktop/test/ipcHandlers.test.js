import { test } from "node:test";
import assert from "node:assert/strict";
import { MemoryStorageAdapter, JewelryService } from "@rhodanthe/core";
import { createHandlers } from "../ipcHandlers.js";

const ringData = {
  name: "Каблучка «Аврора»",
  price: "12400",
  material: "Срібло 925",
  gemstone: "Діамант",
  weight: "3.5",
};

const ring = { id: 1, name: "Каблучка «Аврора»", price: 12400, material: "Срібло 925", gemstone: "Діамант", weight: 3.5 };
const bracelet = { id: 2, name: "Браслет «Крапля роси»", price: 8750, material: "Золото 585", gemstone: "Без каменю", weight: 7 };

function createTestHandlers(initialItems = []) {
  return createHandlers(new JewelryService(new MemoryStorageAdapter(initialItems)));
}

test("add і list: виріб з'являється з полем dateLabel", async () => {
  const handlers = createTestHandlers();

  const result = await handlers.add(ringData);
  const items = await handlers.list("");

  assert.equal(result.ok, true);
  assert.equal(items.length, 1);
  assert.match(items[0].dateLabel, /^\d{2}\.\d{2}\.\d{4}$/);
});

test("add повертає помилку для порожнього та неправильного значення", async () => {
  const handlers = createTestHandlers();

  assert.equal((await handlers.add({ ...ringData, name: "   " })).ok, false);
  assert.equal((await handlers.add(42)).ok, false);
  assert.equal((await handlers.add(undefined)).ok, false);
});

test("list ігнорує запит неправильного типу, а рядковий запит фільтрує", async () => {
  const handlers = createTestHandlers([ring, bracelet]);

  assert.equal((await handlers.list({ evil: true })).length, 2);
  assert.equal((await handlers.list("браслет")).length, 1);
  assert.equal((await handlers.list("діамант")).length, 1);
});

test("remove приймає id як число або рядок", async () => {
  const handlers = createTestHandlers([ring, bracelet]);

  assert.equal((await handlers.remove(1)).ok, true);
  assert.equal((await handlers.remove("2")).ok, true);
  assert.equal((await handlers.remove(99)).ok, false);
  assert.deepEqual(await handlers.list(""), []);
});

test("toggleFavorite і listFavorites: обране з полем dateLabel", async () => {
  const handlers = createTestHandlers([ring, bracelet]);

  assert.equal((await handlers.toggleFavorite("1")).ok, true);
  assert.equal((await handlers.toggleFavorite(99)).ok, false);

  const favorites = await handlers.listFavorites();
  assert.equal(favorites.length, 1);
  assert.equal(favorites[0].name, "Каблучка «Аврора»");
  assert.match(favorites[0].dateLabel, /^\d{2}\.\d{2}\.\d{4}$/);
});