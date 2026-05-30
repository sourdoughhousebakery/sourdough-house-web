"use client";

import { useSyncExternalStore } from "react";
import { CatalogGrid } from "@/components/catalog-grid";
import { catalogPreviewStorageKey, getFeaturedLocalCatalogItems } from "@/lib/catalog/local-preview";
import type { PublicCatalogItem } from "@/lib/catalog/types";

type HomeFeaturedCatalogProps = {
  fallbackItems: PublicCatalogItem[];
  limit?: number;
};

export function HomeFeaturedCatalog({ fallbackItems, limit = 3 }: HomeFeaturedCatalogProps) {
  const rawCatalog = useSyncExternalStore(subscribeToCatalogPreview, getCatalogPreviewSnapshot, getServerCatalogPreviewSnapshot);
  const items = getFeaturedLocalCatalogItems(rawCatalog, fallbackItems, limit);

  return <CatalogGrid items={items} />;
}

function subscribeToCatalogPreview(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function getCatalogPreviewSnapshot() {
  return window.localStorage.getItem(catalogPreviewStorageKey);
}

function getServerCatalogPreviewSnapshot() {
  return null;
}
