import { describe, expect, it } from "vitest";
import type { PublicCatalogItem } from "./types";
import { getFeaturedLocalCatalogItems } from "./local-preview";

const fallbackItems: PublicCatalogItem[] = [
  {
    id: "fallback",
    name: "Fallback loaf",
    description: "Default featured item",
    category: "Bread",
    image: "https://example.com/fallback.jpg",
    price: "$10",
    isActive: true,
    isFeatured: true,
    isTypicallyAvailable: true,
    showPrice: true,
    displayPrice: "$10",
    availabilityLabel: "Typically available"
  }
];

const previewItems: PublicCatalogItem[] = [
  {
    id: "preview-featured",
    name: "Preview featured",
    description: "Saved admin item",
    category: "Bread",
    image: "https://example.com/preview.jpg",
    price: "$12",
    isActive: true,
    isFeatured: true,
    isTypicallyAvailable: true,
    showPrice: true,
    displayPrice: "$12",
    availabilityLabel: "Typically available"
  },
  {
    id: "preview-not-featured",
    name: "Preview regular",
    description: "Saved admin item",
    category: "Sweets",
    image: "https://example.com/regular.jpg",
    price: "$6",
    isActive: true,
    isFeatured: false,
    isTypicallyAvailable: true,
    showPrice: true,
    displayPrice: "$6",
    availabilityLabel: "Typically available"
  }
];

describe("getFeaturedLocalCatalogItems", () => {
  it("uses saved admin preview items for homepage featured catalog", () => {
    expect(getFeaturedLocalCatalogItems(JSON.stringify(previewItems), fallbackItems, 3).map((item) => item.id)).toEqual([
      "preview-featured"
    ]);
  });

  it("falls back when saved preview data is missing or invalid", () => {
    expect(getFeaturedLocalCatalogItems(null, fallbackItems, 3).map((item) => item.id)).toEqual(["fallback"]);
    expect(getFeaturedLocalCatalogItems("not json", fallbackItems, 3).map((item) => item.id)).toEqual(["fallback"]);
  });
});
