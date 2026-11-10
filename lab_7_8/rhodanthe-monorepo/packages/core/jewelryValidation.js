export const MATERIALS = ["Золото 585", "Золото 750", "Срібло 925"];
export const GEMSTONES = ["Без каменю", "Діамант", "Рубін", "Сапфір", "Смарагд", "Топаз", "Перли"];

export const MAX_NAME_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 500;
export const MAX_SIZE_LENGTH = 20;

export const ERROR_NAME_EMPTY = "Будь ласка, введіть назву виробу.";
export const ERROR_NAME_TOO_LONG = `Назва виробу не повинна перевищувати ${MAX_NAME_LENGTH} символів.`;
export const ERROR_PRICE = "Будь ласка, введіть коректну ціну.";
export const ERROR_WEIGHT = "Будь ласка, введіть коректну вагу.";
export const ERROR_MATERIAL = "Оберіть матеріал зі списку.";
export const ERROR_GEMSTONE = "Оберіть камінь зі списку.";
export const ERROR_DESCRIPTION_TOO_LONG = `Опис не повинен перевищувати ${MAX_DESCRIPTION_LENGTH} символів.`;
export const ERROR_SIZE_TOO_LONG = `Розмір не повинен перевищувати ${MAX_SIZE_LENGTH} символів.`;

// обрізає пробіли; усе, що не є рядком, вважається порожнім текстом
export function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

// перетворює число або рядок («1200,5», « 3.2 ») на число, для некоректного значення повертає NaN
export function parseNumber(value) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value !== "string" || value.trim() === "") {
    return NaN;
  }

  return Number(value.trim().replace(",", "."));
}

function isPositiveNumber(value) {
  const number = parseNumber(value);
  return Number.isFinite(number) && number > 0;
}

// перевіряє дані виробу, повертає { isValid, error }
export function validateJewelry(data) {
  if (data === null || typeof data !== "object") {
    return { isValid: false, error: ERROR_NAME_EMPTY };
  }

  const name = cleanText(data.name);

  if (name === "") {
    return { isValid: false, error: ERROR_NAME_EMPTY };
  }

  if (name.length > MAX_NAME_LENGTH) {
    return { isValid: false, error: ERROR_NAME_TOO_LONG };
  }

  if (!isPositiveNumber(data.price)) {
    return { isValid: false, error: ERROR_PRICE };
  }

  if (!isPositiveNumber(data.weight)) {
    return { isValid: false, error: ERROR_WEIGHT };
  }

  if (!MATERIALS.includes(data.material)) {
    return { isValid: false, error: ERROR_MATERIAL };
  }

  if (!GEMSTONES.includes(data.gemstone)) {
    return { isValid: false, error: ERROR_GEMSTONE };
  }

  if (cleanText(data.description).length > MAX_DESCRIPTION_LENGTH) {
    return { isValid: false, error: ERROR_DESCRIPTION_TOO_LONG };
  }

  if (cleanText(data.size).length > MAX_SIZE_LENGTH) {
    return { isValid: false, error: ERROR_SIZE_TOO_LONG };
  }

  return { isValid: true, error: null };
}
