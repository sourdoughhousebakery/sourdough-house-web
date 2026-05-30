import { localCatalogStorageKey } from "@/lib/admin-data/local";
import { getFeaturedCatalogItems } from "./catalog";
import type { PublicCatalogItem } from "./types";

export const catalogPreviewStorageKey = localCatalogStorageKey;

export function getFeaturedLocalCatalogItems(raw: string | null, fallbackItems: PublicCatalogItem[], limit = 3) {
  if (!raw) return fallbackItems;

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return fallbackItems;
    return getFeaturedCatalogItems(parsed as PublicCatalogItem[], limit);
  } catch {
    return fallbackItems;
  }
}
