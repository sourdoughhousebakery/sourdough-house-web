"use client";

import { CatalogGrid } from "@/components/catalog-grid";
import type { PublicCatalogItem } from "@/lib/catalog/types";

type HomeFeaturedCatalogProps = {
  fallbackItems: PublicCatalogItem[];
  limit?: number;
};

export function HomeFeaturedCatalog({ fallbackItems }: HomeFeaturedCatalogProps) {
  return <CatalogGrid items={fallbackItems} />;
}
