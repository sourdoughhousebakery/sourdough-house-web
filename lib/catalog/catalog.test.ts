import { describe, expect, it } from "vitest";
import type { BakeCatalogItem } from "./types";
import {
  createCatalogItem,
  deleteCatalogItem,
  getFeaturedCatalogItems,
  getPublicCatalogItems,
  hydrateCatalogItems,
  updateCatalogItem
} from "./catalog";

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

describe("catalog CRUD helpers", () => {
  it("creates a catalog item with sensible defaults", () => {
    const nextItems = createCatalogItem(items);
    const created = nextItems.at(-1);

    expect(nextItems).toHaveLength(items.length + 1);
    expect(created).toMatchObject({
      name: "New bake",
      category: "Bakery",
      price: "",
      isActive: true,
      isFeatured: false,
      isTypicallyAvailable: false,
      showPrice: false
    });
    expect(created?.id).toMatch(/^catalog-/);
  });

  it("creates a catalog item with a provided id", () => {
    const nextItems = createCatalogItem(items, "catalog-known");

    expect(nextItems.at(-1)?.id).toBe("catalog-known");
  });

  it("updates a catalog item by id without mutating other items", () => {
    const nextItems = updateCatalogItem(items, "country", { name: "Updated Country" });

    expect(nextItems.find((item) => item.id === "country")?.name).toBe("Updated Country");
    expect(nextItems.find((item) => item.id === "seasonal")?.name).toBe("Seasonal Rolls");
  });

  it("deletes a catalog item by id", () => {
    expect(deleteCatalogItem(items, "seasonal").map((item) => item.id)).toEqual(["country", "hidden"]);
  });

  it("hydrates default and custom persisted catalog items", () => {
    const persisted = [
      { ...getPublicCatalogItems(items)[0], name: "Edited Country" },
      {
        id: "catalog-custom",
        name: "Custom Bake",
        description: "Custom item",
        category: "Specials",
        image: "https://example.com/custom.jpg",
        price: "$7",
        isActive: true,
        isFeatured: false,
        isTypicallyAvailable: false,
        showPrice: true,
        displayPrice: "$7",
        availabilityLabel: "Not always on sale"
      }
    ];

    expect(hydrateCatalogItems(items, persisted).map((item) => item.name)).toEqual([
      "Edited Country",
      "Seasonal Rolls",
      "Hidden Bake",
      "Custom Bake"
    ]);
  });
});
