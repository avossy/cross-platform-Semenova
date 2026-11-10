export {
  MATERIALS,
  GEMSTONES,
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
  validateJewelry,
} from "./jewelryValidation.js";

export {
  createJewelry,
  formatJewelryDate,
  withDateLabel,
  sortJewelryByDate,
  filterJewelryByQuery,
  filterFavorites,
  sanitizeJewelry,
} from "./jewelryUtils.js";

export { JewelryStorageAdapter, MemoryStorageAdapter } from "./storageAdapter.js";

export { JewelryService } from "./jewelryService.js";
