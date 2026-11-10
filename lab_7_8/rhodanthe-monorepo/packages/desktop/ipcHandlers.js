import { withDateLabel } from "@rhodanthe/core";

export function createHandlers(service) {
  return {
    async list(query) {
      return withDateLabel(await service.list(typeof query === "string" ? query : ""));
    },

    async listFavorites() {
      return withDateLabel(await service.listFavorites());
    },

    add(data) {
      return service.add(data !== null && typeof data === "object" ? data : {});
    },

    remove(id) {
      return service.remove(Number(id));
    },

    toggleFavorite(id) {
      return service.toggleFavorite(Number(id));
    },
  };
}
