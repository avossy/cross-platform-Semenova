import { test } from "node:test";
import assert from "node:assert/strict";
import {
  validateJewelry,
  MAX_NAME_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  MAX_SIZE_LENGTH,
  ERROR_NAME_EMPTY,
  ERROR_NAME_TOO_LONG,
  ERROR_PRICE,
  ERROR_WEIGHT,
  ERROR_MATERIAL,
  ERROR_GEMSTONE,
  ERROR_DESCRIPTION_TOO_LONG,
  ERROR_SIZE_TOO_LONG,
} from "../jewelryValidation.js";

const validData = {
  name: "Каблучка «Аврора»",
  description: "Срібло з діамантом",
  price: "12400",
  material: "Срібло 925",
  gemstone: "Діамант",
  weight: "3.5",
  size: "17",
};

test("коректні дані проходять перевірку", () => {
  assert.deepEqual(validateJewelry(validData), { isValid: true, error: null });
});

test("опис і розмір необов'язкові", () => {
  const { description, size, ...required } = validData;
  assert.equal(validateJewelry(required).isValid, true);
});

test("порожня назва, самі пробіли й не об'єкт не проходять перевірку", () => {
  assert.deepEqual(validateJewelry({ ...validData, name: "" }), { isValid: false, error: ERROR_NAME_EMPTY });
  assert.deepEqual(validateJewelry({ ...validData, name: "    " }), { isValid: false, error: ERROR_NAME_EMPTY });
  assert.equal(validateJewelry(undefined).isValid, false);
  assert.equal(validateJewelry(null).isValid, false);
});

test("межа довжини назви: MAX_NAME_LENGTH допустимо, на один більше — ні", () => {
  assert.equal(validateJewelry({ ...validData, name: "а".repeat(MAX_NAME_LENGTH) }).isValid, true);
  assert.deepEqual(validateJewelry({ ...validData, name: "а".repeat(MAX_NAME_LENGTH + 1) }), {
    isValid: false,
    error: ERROR_NAME_TOO_LONG,
  });
});

test("ціна має бути додатним числом (рядок із комою теж допустимий)", () => {
  for (const price of ["", "abc", "0", "-5", undefined, 0, NaN]) {
    assert.deepEqual(validateJewelry({ ...validData, price }), { isValid: false, error: ERROR_PRICE });
  }
  assert.equal(validateJewelry({ ...validData, price: "1200,5" }).isValid, true);
  assert.equal(validateJewelry({ ...validData, price: 1200 }).isValid, true);
});

test("вага має бути додатним числом", () => {
  for (const weight of ["", "abc", "0", "-1.2", undefined]) {
    assert.deepEqual(validateJewelry({ ...validData, weight }), { isValid: false, error: ERROR_WEIGHT });
  }
});

test("матеріал і камінь мають бути зі списків", () => {
  assert.deepEqual(validateJewelry({ ...validData, material: "Мідь" }), { isValid: false, error: ERROR_MATERIAL });
  assert.deepEqual(validateJewelry({ ...validData, gemstone: "Скло" }), { isValid: false, error: ERROR_GEMSTONE });
});

test("межі довжини опису та розміру", () => {
  assert.equal(validateJewelry({ ...validData, description: "а".repeat(MAX_DESCRIPTION_LENGTH) }).isValid, true);
  assert.deepEqual(validateJewelry({ ...validData, description: "а".repeat(MAX_DESCRIPTION_LENGTH + 1) }), {
    isValid: false,
    error: ERROR_DESCRIPTION_TOO_LONG,
  });
  assert.equal(validateJewelry({ ...validData, size: "1".repeat(MAX_SIZE_LENGTH) }).isValid, true);
  assert.deepEqual(validateJewelry({ ...validData, size: "1".repeat(MAX_SIZE_LENGTH + 1) }), {
    isValid: false,
    error: ERROR_SIZE_TOO_LONG,
  });
});
