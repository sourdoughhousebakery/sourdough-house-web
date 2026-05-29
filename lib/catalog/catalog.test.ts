import { describe, expect, it } from "vitest";
import type { BakeCatalogItem } from "./types";
import { getFeaturedCatalogItems, getPublicCatalogItems } from "./catalog";

const items: BakeCatalogItem[] = [
  {
    id: "country",
    name: "Country Sourdough",
    description: "Classic loaf",
    category: "Bread",
    image: "https://example.com/country.jpg",
    price: "$10",
    isActive: true,
    isFeatured: true,
    isTypicallyAvailable: true,
    showPrice: true
  },
  {
    id: "seasonal",
    name: "Seasonal Rolls",
    description: "Rotating bake",
    category: "Specials",
    image: "https://example.com/rolls.jpg",
    price: "$24",
    isActive: true,
    isFeatured: false,
    isTypicallyAvailable: false,
    showPrice: false,
    note: "Seasonal"
  },
  {
    id: "hidden",
    name: "Hidden Bake",
    description: "Not public",
    category: "Draft",
    image: "https://example.com/hidden.jpg",
    price: "$1",
    isActive: false,
    isFeatured: true,
    isTypicallyAvailable: true,
    showPrice: true
  }
];

describe("getPublicCatalogItems", () => {
  it("shows only active catalog items", () => {
    expect(getPublicCatalogItems(items).map((item) => item.id)).toEqual(["country", "seasonal"]);
  });

  it("hides prices when showPrice is false", () => {
    const publicItems = getPublicCatalogItems(items);

    expect(publicItems.find((item) => item.id === "country")?.displayPrice).toBe("$10");
    expect(publicItems.find((item) => item.id === "seasonal")?.displayPrice).toBeNull();
  });

  it("labels items that are typical bakes but not usually on sale", () => {
    const publicItems = getPublicCatalogItems(items);

    expect(publicItems.find((item) => item.id === "country")?.availabilityLabel).toBe("Typically available");
    expect(publicItems.find((item) => item.id === "seasonal")?.availabilityLabel).toBe("Not always on sale");
  });
});

describe("getFeaturedCatalogItems", () => {
  it("returns active featured items up to the requested limit", () => {
    expect(getFeaturedCatalogItems(items, 1).map((item) => item.id)).toEqual(["country"]);
  });
});
