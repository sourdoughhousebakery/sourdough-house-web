import { describe, expect, it } from "vitest";
import { formatHotplatePrice, parseMenuFromEventDetail } from "./api";

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
