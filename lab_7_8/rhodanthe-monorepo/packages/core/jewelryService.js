import { validateJewelry } from "./jewelryValidation.js";
import {
  createJewelry,
  filterFavorites,
  filterJewelryByQuery,
  sanitizeJewelry,
  sortJewelryByDate,
} from "./jewelryUtils.js";

const ERROR_NOT_FOUND = "Виріб не знайдено.";

export class JewelryService {
  constructor(adapter, { now = () => new Date() } = {}) {
    this.adapter = adapter;
    this.now = now;
  }

  // каталог: усі вироби (за потреби — відфільтровані за запитом), спочатку новіші
  async list(query = "") {
    const items = sanitizeJewelry(await this.adapter.load());
    return sortJewelryByDate(filterJewelryByQuery(items, query));
  }

  // обране: лише вироби з прапорцем favorite, спочатку новіші
  async listFavorites() {
    const items = sanitizeJewelry(await this.adapter.load());
    return sortJewelryByDate(filterFavorites(items));
  }

  // додає виріб після перевірки, повертає { ok, item } або { ok: false, error }
  async add(data) {
    const validation = validateJewelry(data);
    if (!validation.isValid) {
      return { ok: false, error: validation.error };
    }

    const items = sanitizeJewelry(await this.adapter.load());
    const now = this.now();
    const lastId = items.reduce((max, item) => Math.max(max, item.id), 0);

    // id має бути унікальним навіть тоді, коли два вироби додано в одну мілісекунду
    const item = createJewelry(data, { id: Math.max(now.getTime(), lastId + 1), now });
    await this.adapter.save([...items, item]);
    return { ok: true, item };
  }

  // видаляє виріб за id (разом із ним зникає й запис в обраному), повертає { ok } або { ok: false, error }
  async remove(id) {
    const items = sanitizeJewelry(await this.adapter.load());
    const rest = items.filter((item) => item.id !== id);

    if (rest.length === items.length) {
      return { ok: false, error: ERROR_NOT_FOUND };
    }
    await this.adapter.save(rest);
    return { ok: true };
  }

  // додає виріб в обране або прибирає його звідти, повертає { ok, item } або { ok: false, error }
  async toggleFavorite(id) {
    const items = sanitizeJewelry(await this.adapter.load());
    const target = items.find((item) => item.id === id);
    if (!target) {
      return { ok: false, error: ERROR_NOT_FOUND };
    }

    const updated = { ...target, favorite: target.favorite !== true };
    await this.adapter.save(items.map((item) => (item.id === id ? updated : item)));
    return { ok: true, item: updated };
  }
}
