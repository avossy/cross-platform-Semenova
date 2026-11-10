import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createJewelry,
  formatJewelryDate,
  withDateLabel,
  sortJewelryByDate,
  filterJewelryByQuery,
  filterFavorites,
  sanitizeJewelry,
} from "../jewelryUtils.js";

const ring = { id: 1, name: "Каблучка «Аврора»", price: 12400, material: "Срібло 925", gemstone: "Діамант", weight: 3.5 };
const earrings = { id: 2, name: "Сережки «Ніжність»", price: 3200, material: "Срібло 925", gemstone: "Перли", weight: 2 };
const bracelet = { id: 3, name: "Браслет «Крапля роси»", price: 8750, material: "Золото 585", gemstone: "Без каменю", weight: 7 };

test("createJewelry обрізає пробіли, перетворює числа й зберігає дату створення", () => {
  const now = new Date("2026-11-03T10:00:00.000Z");
  const item = createJewelry(
    { name: "  Каблучка  ", description: " Опис ", price: "1200,5", material: "Срібло 925", gemstone: "Рубін", weight: "3.5", size: " 17 " },
    { id: 7, now }
  );

  assert.deepEqual(item, {
    id: 7,
    name: "Каблучка",
    description: "Опис",
    price: 1200.5,
    material: "Срібло 925",
    gemstone: "Рубін",
    weight: 3.5,
    size: "17",
    favorite: false,
    createdAt: "2026-11-03T10:00:00.000Z",
  });
});

test("formatJewelryDate форматує дату як дд.мм.рррр", () => {
  assert.equal(formatJewelryDate(new Date(2026, 10, 3, 12, 0)), "03.11.2026");
});

test("formatJewelryDate повертає порожній рядок для некоректної дати", () => {
  assert.equal(formatJewelryDate("не дата"), "");
});

test("withDateLabel додає dateLabel і не змінює вихідні вироби", () => {
  const items = [{ ...ring, createdAt: new Date(2026, 10, 3, 12, 0).toISOString() }];
  const labeled = withDateLabel(items);

  assert.equal(labeled[0].dateLabel, "03.11.2026");
  assert.equal("dateLabel" in items[0], false);
});

test("sortJewelryByDate ставить новіші вироби першими й не змінює вихідний масив", () => {
  const items = [
    { ...ring, createdAt: "2026-01-01T00:00:00.000Z" },
    { ...earrings, createdAt: "2026-06-01T00:00:00.000Z" },
  ];
  const sorted = sortJewelryByDate(items);

  assert.deepEqual(sorted.map((item) => item.id), [2, 1]);
  assert.deepEqual(items.map((item) => item.id), [1, 2]);
});

test("sortJewelryByDate підтримує старі записи без createdAt (за id)", () => {
  const items = [{ ...ring, id: 100 }, { ...earrings, id: 200 }];
  assert.deepEqual(sortJewelryByDate(items).map((item) => item.id), [200, 100]);
});

test("filterJewelryByQuery шукає за назвою, матеріалом і каменем без урахування регістру", () => {
  const items = [ring, earrings, bracelet];

  assert.deepEqual(filterJewelryByQuery(items, "АВРОРА"), [ring]);
  assert.deepEqual(filterJewelryByQuery(items, "золото"), [bracelet]);
  assert.deepEqual(filterJewelryByQuery(items, "перли"), [earrings]);
  assert.deepEqual(filterJewelryByQuery(items, "срібло").map((item) => item.id), [1, 2]);
  assert.deepEqual(filterJewelryByQuery(items, "нічого"), []);
});

test("filterJewelryByQuery: порожній запит повертає все", () => {
  const items = [ring, earrings];
  assert.deepEqual(filterJewelryByQuery(items, "   "), items);
  assert.deepEqual(filterJewelryByQuery(items), items);
});

test("filterFavorites залишає лише вироби з favorite: true", () => {
  const items = [{ ...ring, favorite: true }, { ...earrings, favorite: false }, bracelet];
  assert.deepEqual(filterFavorites(items).map((item) => item.id), [1]);
});

test("sanitizeJewelry відкидає некоректні записи", () => {
  const items = [
    ring,
    { ...earrings, id: "2" },
    { ...bracelet, name: "  " },
    { ...bracelet, price: 0 },
    { ...bracelet, weight: "7" },
    null,
    "рядок",
  ];

  assert.deepEqual(sanitizeJewelry(items), [ring]);
  assert.deepEqual(sanitizeJewelry({ id: 1 }), []);
});
