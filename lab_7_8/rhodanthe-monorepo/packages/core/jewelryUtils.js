import { cleanText, parseNumber } from "./jewelryValidation.js";

// створює об'єкт виробу зі збереженням дати створення, нові вироби спочатку не в обраному
export function createJewelry(data, { id = Date.now(), now = new Date() } = {}) {
  return {
    id,
    name: cleanText(data.name),
    description: cleanText(data.description),
    price: parseNumber(data.price),
    material: data.material,
    gemstone: data.gemstone,
    weight: parseNumber(data.weight),
    size: cleanText(data.size),
    favorite: false,
    createdAt: now.toISOString(),
  };
}

// форматує дату створення у вигляді дд.мм.рррр, для некоректної дати повертає порожній рядок
export function formatJewelryDate(value) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// додає до кожного виробу поле dateLabel — дату для показу в інтерфейсі
export function withDateLabel(items) {
  return items.map((item) => ({ ...item, dateLabel: formatJewelryDate(item.createdAt ?? item.id) }));
}

// час створення виробу, для старих записів без createdAt використовується id (мітка часу)
function getJewelryTime(item) {
  const time = new Date(item.createdAt ?? item.id).getTime();
  return Number.isNaN(time) ? 0 : time;
}

// сортування: спочатку новіші вироби, вихідний масив не змінюється
export function sortJewelryByDate(items) {
  return [...items].sort((a, b) => getJewelryTime(b) - getJewelryTime(a));
}

// пошук за підрядком у назві, матеріалі чи камені без урахування регістру
export function filterJewelryByQuery(items, query = "") {
  const normalizedQuery = query.trim().toLowerCase();

  if (normalizedQuery === "") {
    return items;
  }

  return items.filter((item) =>
    [item.name, item.material, item.gemstone].some((field) => field.toLowerCase().includes(normalizedQuery))
  );
}

// лише вироби, додані в обране
export function filterFavorites(items) {
  return items.filter((item) => item.favorite === true);
}

// лише коректні записи: об'єкти з числовим id, назвою, додатними ціною й вагою
export function sanitizeJewelry(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.filter(
    (item) =>
      item !== null &&
      typeof item === "object" &&
      typeof item.id === "number" &&
      typeof item.name === "string" &&
      item.name.trim() !== "" &&
      Number.isFinite(item.price) &&
      item.price > 0 &&
      Number.isFinite(item.weight) &&
      item.weight > 0 &&
      typeof item.material === "string" &&
      typeof item.gemstone === "string"
  );
}
