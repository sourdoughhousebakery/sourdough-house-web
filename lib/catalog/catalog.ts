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

export function createCatalogItem(items: BakeCatalogItem[]): BakeCatalogItem[] {
  const id = `catalog-${Date.now().toString(36)}`;

  return [
    ...items,
    {
      id,
      name: "New bake",
      description: "Describe this bake so customers understand what makes it special.",
      category: "Bakery",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
      price: "",
      isActive: true,
      isFeatured: false,
      isTypicallyAvailable: false,
      showPrice: false,
      note: "New item"
    }
  ];
}

export function updateCatalogItem(
  items: BakeCatalogItem[],
  id: string,
  patch: Partial<BakeCatalogItem>
): BakeCatalogItem[] {
  return items.map((item) => (item.id === id ? { ...item, ...patch, id: item.id } : item));
}

export function deleteCatalogItem(items: BakeCatalogItem[], id: string): BakeCatalogItem[] {
  return items.filter((item) => item.id !== id);
}

export function hydrateCatalogItems(
  defaultItems: BakeCatalogItem[],
  persistedItems: PublicCatalogItem[]
): BakeCatalogItem[] {
  const defaultIds = new Set(defaultItems.map((item) => item.id));
  const mergedDefaults = defaultItems.map((defaultItem) => {
    const stored = persistedItems.find((item) => item.id === defaultItem.id);
    return stored ? { ...defaultItem, ...stored } : defaultItem;
  });
  const customItems = persistedItems.filter((item) => !defaultIds.has(item.id));

  return [...mergedDefaults, ...customItems];
}
