import { test } from "node:test";
import assert from "node:assert/strict";
import { createAppServer, resolveFilePath } from "../server.js";

test("resolveFilePath: головна сторінка та файли ядра дозволені", () => {
  assert.ok(resolveFilePath("/").endsWith("index.html"));
  assert.ok(resolveFilePath("/node_modules/@rhodanthe/core/index.js").endsWith("index.js"));
});

test("resolveFilePath: вихід за межі теки та серверні файли заборонені", () => {
  assert.equal(resolveFilePath("/../package.json"), null);
  assert.equal(resolveFilePath("/node_modules/@rhodanthe/core/../../../../etc/passwd"), null);
  assert.equal(resolveFilePath("/server.js"), null);
  assert.equal(resolveFilePath("/%E0%A4%A"), null);
  assert.equal(resolveFilePath("/node_modules/@rhodanthe/core/test/jewelryService.test.js"), null);
});

test("сервер віддає index.html і модуль ядра з правильними типами", async () => {
  const server = createAppServer();
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();

  try {
    const page = await fetch(`http://localhost:${port}/`);
    assert.equal(page.status, 200);
    assert.match(page.headers.get("content-type"), /text\/html/);

    const core = await fetch(`http://localhost:${port}/node_modules/@rhodanthe/core/index.js`);
    assert.equal(core.status, 200);
    assert.match(core.headers.get("content-type"), /text\/javascript/);

    const missing = await fetch(`http://localhost:${port}/nope.js`);
    assert.equal(missing.status, 404);
  } finally {
    server.close();
  }
});