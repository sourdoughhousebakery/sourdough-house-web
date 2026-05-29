import { bakeCatalogItems } from "@/content/site-content";
import type { BakeCatalogItem, PublicCatalogItem } from "./types";

export function getPublicCatalogItems(items: BakeCatalogItem[] = bakeCatalogItems): PublicCatalogItem[] {
  return items
    .filter((item) => item.isActive)
    .map((item) => ({
      ...item,
      displayPrice: item.showPrice ? item.price : null,
      availabilityLabel: item.isTypicallyAvailable ? "Typically available" : "Not always on sale"
    }));
}

export function getFeaturedCatalogItems(items: BakeCatalogItem[] = bakeCatalogItems, limit = 3): PublicCatalogItem[] {
  return getPublicCatalogItems(items)
    .filter((item) => item.isFeatured)
    .slice(0, limit);
}

