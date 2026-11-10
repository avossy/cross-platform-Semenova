import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { JewelryService } from "@rhodanthe/core";
import { FileStorageAdapter } from "../fileStorageAdapter.js";

async function createTempFile() {
  const dir = await mkdtemp(join(tmpdir(), "rhodanthe-"));
  return join(dir, "data", "jewelry.json");
}

const ringData = {
  name: "Каблучка «Аврора»",
  price: "12400",
  material: "Срібло 925",
  gemstone: "Діамант",
  weight: "3.5",
};

test("load повертає [], якщо файлу немає", async () => {
  const adapter = new FileStorageAdapter(await createTempFile());
  assert.deepEqual(await adapter.load(), []);
});

test("save створює теку та файл, load читає дані назад", async () => {
  const filePath = await createTempFile();
  const adapter = new FileStorageAdapter(filePath);
  const items = [
    { id: 1, name: "Каблучка", price: 12400, material: "Срібло 925", gemstone: "Діамант", weight: 3.5 },
  ];

  await adapter.save(items);

  assert.deepEqual(JSON.parse(await readFile(filePath, "utf-8")), items);
  assert.deepEqual(await adapter.load(), items);
});

test("load повертає [] для пошкодженого файлу", async () => {
  const filePath = await createTempFile();
  const adapter = new FileStorageAdapter(filePath);
  await adapter.save([]);
  await writeFile(filePath, "{не json", "utf-8");

  assert.deepEqual(await adapter.load(), []);
});

test("адаптер працює зі спільним JewelryService", async () => {
  const adapter = new FileStorageAdapter(await createTempFile());
  const service = new JewelryService(adapter);

  const added = await service.add(ringData);
  assert.equal(added.ok, true);

  // новий сервіс з тим самим файлом бачить збережені дані
  const reopened = new JewelryService(new FileStorageAdapter(adapter.filePath));
  assert.equal((await reopened.list()).length, 1);
});