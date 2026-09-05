import { describe, expect, it } from "vitest";
import { formatHotplatePrice, parseMenuFromEventDetail, resolveDisplayMenuItems, resolveHotplateOrderUrl } from "./api";
import type { MenuResult } from "./types";

describe("resolveHotplateOrderUrl", () => {
  const storefront = "https://hotplate.com/bakery";
  const liveMenu: MenuResult = {
    source: "live",
    items: parseMenuFromEventDetail({ menuItems: { bread: { id: "bread", title: "Bread" } } }),
    event: {
      id: "current-drop",
      title: "Current bake",
      description: "",
      image: null,
      status: "live",
      goLiveTime: null,
      isPickupEnabled: true,
      isDeliveryEnabled: false
    }
  };

  it("opens the same live drop as the displayed products", () => {
    expect(resolveHotplateOrderUrl(liveMenu, storefront)).toBe(`${storefront}/current-drop`);
    expect(resolveHotplateOrderUrl({ ...liveMenu, event: { ...liveMenu.event!, id: "next-drop" } }, storefront)).toBe(`${storefront}/next-drop`);
  });

  it.each(["fallback", "past"] as const)("uses the storefront for a %s menu even if an old event remains", (source) => {
    expect(resolveHotplateOrderUrl({ ...liveMenu, source }, storefront)).toBe(storefront);
  });

  it("uses the storefront when the live menu or event is missing", () => {
    expect(resolveHotplateOrderUrl({ ...liveMenu, items: [] }, storefront)).toBe(storefront);
    expect(resolveHotplateOrderUrl({ ...liveMenu, event: null }, storefront)).toBe(storefront);
    expect(resolveHotplateOrderUrl({ ...liveMenu, event: { ...liveMenu.event!, id: "" } }, storefront)).toBe(storefront);
  });
});

describe("formatHotplatePrice", () => {
  it("formats numeric Hotplate prices", () => {
    expect(formatHotplatePrice("10.00")).toBe("$10");
    expect(formatHotplatePrice(12.5)).toBe("$12.50");
  });

  it("keeps non-numeric price labels usable", () => {
    expect(formatHotplatePrice("Market price")).toBe("Market price");
    expect(formatHotplatePrice(null)).toBe("See menu");
  });
});

describe("parseMenuFromEventDetail", () => {
  it("maps active menu items and removes deleted items", () => {
    const items = parseMenuFromEventDetail({
      eventMenuSections: [{ index: 0, title: "Bread" }],
      menuItems: {
        one: {
          id: "one",
          title: "Country Sourdough",
          price: "10.00",
          description: "Slow fermented",
          image: "https://example.com/bread.jpg",
          sectionIndex: 0,
          inventoryInfo: { sold: 7, available: "Infinity" }
        },
        two: {
          id: "two",
          title: "Archived",
          isDeleted: true
        }
      }
    });

    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      id: "one",
      name: "Country Sourdough",
      price: "$10",
      sold: 7,
      available: null,
      isAvailable: true,
      category: "Bread"
    });
  });

  it("handles sold out inventory", () => {
    const items = parseMenuFromEventDetail({
      menuItems: {
        one: {
          id: "one",
          title: "Cookies",
          price: "18",
          inventoryInfo: { available: 0 }
        }
      }
    });

    expect(items[0]?.isAvailable).toBe(false);
  });
});

describe("resolveDisplayMenuItems", () => {
  it("does not invent Hotplate items when the menu source is not live", () => {
    const pastMenu = {
      items: [
        {
          id: "past",
          name: "Past Hotplate Item",
          price: "$10",
          description: "",
          image: "https://example.com/past.jpg",
          sold: 0,
          available: null,
          isAvailable: true,
          category: "Bakery",
          source: "hotplate" as const
        }
      ],
      event: null,
      source: "past" as const
    };

    expect(resolveDisplayMenuItems(pastMenu, 1)).toEqual([]);
  });
});
