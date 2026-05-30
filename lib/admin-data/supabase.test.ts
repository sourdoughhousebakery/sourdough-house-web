import { describe, expect, it } from "vitest";
import { catalogItemFromRow, catalogItemToRow, testimonialFromRow, testimonialToRow } from "./supabase";

describe("SupabaseAdminDataSource row mapping", () => {
  it("maps catalog rows to editable catalog items", () => {
    expect(
      catalogItemFromRow({
        id: "country",
        name: "Country Sourdough",
        description: "Classic loaf",
        category: "Bread",
        image: "https://example.com/country.jpg",
        price: "$10",
        note: "Core bake",
        is_active: true,
        is_featured: true,
        is_typically_available: false,
        show_price: false,
        sort_order: 2
      })
    ).toMatchObject({
      id: "country",
      name: "Country Sourdough",
      isActive: true,
      isFeatured: true,
      isTypicallyAvailable: false,
      showPrice: false
    });
  });

  it("maps catalog item patches to snake_case rows", () => {
    expect(catalogItemToRow({ isActive: false, isFeatured: true, showPrice: false })).toEqual({
      is_active: false,
      is_featured: true,
      show_price: false
    });
  });

  it("maps testimonial rows and patches", () => {
    const row = {
      id: "testimonial-1",
      quote: "Loved it.",
      name: "Customer",
      source: "Email",
      is_active: true,
      sort_order: 1
    };

    expect(testimonialFromRow(row)).toEqual({
      id: "testimonial-1",
      quote: "Loved it.",
      name: "Customer",
      source: "Email",
      isActive: true
    });
    expect(testimonialToRow({ isActive: false, source: "Pickup note" })).toEqual({
      is_active: false,
      source: "Pickup note"
    });
  });
});
