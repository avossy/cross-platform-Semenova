import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const WEB_DIR = dirname(fileURLToPath(import.meta.url));
const CORE_DIR = dirname(fileURLToPath(import.meta.resolve("@rhodanthe/core")));
const CORE_PREFIX = "/node_modules/@rhodanthe/core/";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

// файли веб-клієнта, які дозволено віддавати браузеру (білий список).
// серверний код (server.js), package.json і тести назовні не віддаються.
const WEB_FILES = ["index.html", "style.css", "script.js", "localStorageAdapter.js"];

// перетворює URL-шлях на шлях до файлу на диску. Повертає null для заборонених шляхів
export function resolveFilePath(urlPath) {
  let pathname;

  try {
    pathname = decodeURIComponent(urlPath.split("?")[0]);
  } catch {
    return null; // некоректне кодування URL (наприклад, %E0%A4%A)
  }

  // модулі ядра: лише .js-файли самого пакета (без тек, наприклад test/)
  if (pathname.startsWith(CORE_PREFIX)) {
    const fileName = pathname.slice(CORE_PREFIX.length);
    return /^[\w-]+\.js$/.test(fileName) ? join(CORE_DIR, fileName) : null;
  }

  // файли веб-клієнта
  const fileName = pathname === "/" ? "index.html" : pathname.slice(1);
  return WEB_FILES.includes(fileName) ? join(WEB_DIR, fileName) : null;
}

export function createAppServer() {
  return createServer(async (request, response) => {
    const filePath = resolveFilePath(request.url);

    if (!filePath) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Не знайдено");
      return;
    }

    try {
      const content = await readFile(filePath);
      response.writeHead(200, { "Content-Type": MIME_TYPES[extname(filePath)] });
      response.end(content);
    } catch {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Не знайдено");
    }
  });
}

// запуск сервера лише тоді, коли файл виконано напряму (node server.js), а не імпортовано в тестах
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT) || 3000;

  createAppServer().listen(port, () => {
    console.log(`Rhodanthe Web: http://localhost:${port}`);
  });
}
