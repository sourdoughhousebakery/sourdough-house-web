import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const catalogGrid = readFileSync("components/catalog-grid.tsx", "utf8");
const menuGrid = readFileSync("components/menu-grid.tsx", "utf8");
const modal = readFileSync("components/menu-item-detail-modal.tsx", "utf8");

describe("menu item detail modal wiring", () => {
  it("keeps card descriptions compact and opens detail modals from catalog cards", () => {
    expect(catalogGrid).toContain("line-clamp-3");
    expect(catalogGrid).toContain("MenuItemDetailModal");
    expect(catalogGrid).toContain("setSelectedItem");
  });

  it("keeps card descriptions compact and opens detail modals from live menu cards", () => {
    expect(menuGrid).toContain("line-clamp-3");
    expect(menuGrid).toContain("MenuItemDetailModal");
    expect(menuGrid).toContain("setSelectedItem");
  });

  it("fills modal image panels with centered cropping and keeps close control at the modal corner", () => {
    expect(modal).toContain("object-cover object-center");
    expect(modal).toContain("absolute right-4 top-4");
  });
});
