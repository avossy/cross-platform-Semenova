# Rhodanthe - застосунок ювелірного салону

![readme_banner.jpg](docs/readme_banner.jpg)

Лабораторні роботи з дисципліни «Кросплатформне програмування». Наскрізною темою всіх робіт є застосунок ювелірного салону **Rhodanthe**.

Автор: Семенова Ярослава ([@avossy](https://github.com/avossy)).

## Лабораторні роботи

| №   | Що реалізовано                                                    | Технології                                         | Де зберігаються дані       | Папка                                                    |
|-----|-------------------------------------------------------------------|----------------------------------------------------|----------------------------|----------------------------------------------------------|
| 1   | Вебсторінка салону з каталогом і списком обраного                 | HTML5, CSS3, JavaScript                            | не зберігаються            | [lab_1](lab_1)                                           |
| 2   | REST API каталогу виробів (CRUD, валідація запитів)               | Node.js, Express 5, Mongoose                       | MongoDB                    | [lab_2](lab_2)                                           |
| 3   | GraphQL API з реєстрацією, входом і захищеними мутаціями          | Apollo Server, GraphQL, JWT, bcryptjs, Docker      | пам'ять сервера            | [lab_3](lab_3)                                           |
| 4   | Односторінковий застосунок для керування виробами                 | React 19, Vite, Tailwind CSS 4                     | `localStorage`             | [lab_4/rhodanthe-spa](lab_4/rhodanthe-spa)               |
| 5   | Мобільний застосунок для Android та iOS                           | React Native, Expo SDK 58                          | пам'ять застосунку         | [lab_5/rhodanthe-mobile](lab_5/rhodanthe-mobile)         |
| 6   | Десктопний застосунок                                             | Electron, IPC, `contextBridge`                     | JSON-файл на диску         | [lab_6/rhodanthe-desktop](lab_6/rhodanthe-desktop)       |
| 7–8 | Монорепозиторій: спільне ядро та веб- і десктоп-клієнти з тестами | npm workspaces, ES-модулі, Electron, `node --test` | `localStorage` / JSON-файл | [lab_7_8/rhodanthe-monorepo](lab_7_8/rhodanthe-monorepo) |

Усі роботи пов'язані спільною предметною областю (ювелірні вироби з матеріалом, каменем, вагою, розміром і ціною) та спільним візуальним стилем. Кожна наступна показує те саме на іншому рівні: у ЛР №2–3 з'являється серверна частина, у ЛР №4–6 клієнти для трьох платформ, а в ЛР №7–8 їхню спільну логіку винесено в окремий пакет `@rhodanthe/core`. Докладний опис стеку технологій за рівнями архітектури міститься в [README монорепозиторію](lab_7_8/rhodanthe-monorepo/README.md).

## Вимоги

- Node.js 20.6 або новіший (перевірено на Node.js 22) та npm
- ЛР №2: підключення до MongoDB (локальної або хмарної)
- ЛР №3: змінна середовища `JWT_SECRET`; Docker потрібен лише для запуску в контейнері
- ЛР №5: смартфон із застосунком Expo Go або емулятор Android / iOS
  Кожен проєкт має власні залежності, тому `npm install` виконують у його теці, а не в корені репозиторію.

## Запуск

**ЛР №1.** Відкрийте [lab_1/lab_1.html](lab_1/lab_1.html) у браузері. Кореневу сторінку [index.html](index.html) зі списком робіт також можна відкрити локально.

**ЛР №2 (REST API).** Створіть файл `lab_2/.env` (його не додано до репозиторію):

```
MONGO_URI=mongodb://127.0.0.1:27017/rhodanthe
PORT=3000
```

```bash
cd lab_2
npm install
npm start
```

Сервер запускається на `http://localhost:3000`. Маршрути: `GET /api/products`, `GET /api/products/:id`, `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id`.

**ЛР №3 (GraphQL API).** Секрет для підпису токенів задається змінною середовища, у коді його немає.

```bash
cd lab_3
npm install
JWT_SECRET=ваш_секрет npm start           # macOS / Linux
$env:JWT_SECRET="ваш_секрет"; npm start   # Windows PowerShell
```

Сервер слухає `http://localhost:4001`. Запити: `users`, `me`, `products`, `product(id)`. Мутації: `register`, `login`, `createProduct`, `deleteProduct` (дві останні потребують токена в заголовку `Authorization: Bearer …`). Дані зберігаються лише в пам'яті й зникають після перезапуску. Запуск у Docker:

```bash
docker build -t rhodanthe-graphql lab_3
docker run -p 4001:4001 -e JWT_SECRET=ваш_секрет rhodanthe-graphql
```

**ЛР №4 (React SPA).**

```bash
cd lab_4/rhodanthe-spa
npm install
npm run dev
```

**ЛР №5 (React Native).**

```bash
cd lab_5/rhodanthe-mobile
npm install
npm start
```

Відскануйте QR-код у Expo Go (комп'ютер і телефон мають бути в одній мережі) або натисніть `a` / `i` для емулятора. Web-режим не підтримується для перевірки, бо в ньому не працює `Alert.alert`.

**ЛР №6 (Electron).**

```bash
cd lab_6/rhodanthe-desktop
npm install
npm start
```

Вироби зберігаються у файлі `jewelry.json` у системній теці даних застосунку.

**ЛР №7–8 (монорепозиторій).**

```bash
cd lab_7_8/rhodanthe-monorepo
npm install
npm test                 # тести ядра, веб- і десктопного клієнтів
npm run start:web        # http://localhost:3000
npm run start:desktop    # вікно Electron
```

Якщо порт 3000 зайнятий (наприклад, запущено ЛР №2), задайте інший порт змінною `PORT` для веб-клієнта.

## Структура репозиторію

```
cross-platform-Semenova/
├── index.html
├── docs/ 
├── lab_1/ 
├── lab_2/ 
├── lab_3/ 
├── lab_4/rhodanthe-spa/
├── lab_5/rhodanthe-mobile/
├── lab_6/rhodanthe-desktop/
└── lab_7_8/rhodanthe-monorepo/
    └── packages/
        ├── core/
        ├── web/ 
        └── desktop/ 
```

Тека `docs` містить схеми, ER-діаграму, каркаси та макети, які стосуються проєктування застосунку Rhodanthe.
 