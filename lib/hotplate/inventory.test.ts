import { describe, expect, it } from "vitest";
import { parseAvailableInventory, formatInventoryLabel } from "./inventory";

describe("remaining inventory", () => {
  it.each([[9, 9], ["16", 16], [0, 0], ["0", 0], [-2, 0]])("parses %s as %s available", (raw, expected) => {
    expect(parseAvailableInventory(raw)).toBe(expected);
  });

  it.each([undefined, null, "Infinity", Infinity, NaN, "", " ", "unknown", false])("does not invent a count for %s", (raw) => {
    expect(parseAvailableInventory(raw)).toBeNull();
  });

  it("shows remaining units and sold-out status without displaying unlimited stock", () => {
    expect(formatInventoryLabel(9)).toBe("9 left");
    expect(formatInventoryLabel(16)).toBe("16 left");
    expect(formatInventoryLabel(1)).toBe("1 left");
    expect(formatInventoryLabel(0)).toBe("Sold out");
    expect(formatInventoryLabel(null)).toBeUndefined();
  });
});
