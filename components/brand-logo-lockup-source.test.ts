import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const lockup = readFileSync("components/brand-logo-lockup.tsx", "utf8");
const footer = readFileSync("components/site-footer.tsx", "utf8");

describe("brand logo lockup", () => {
  it("supports horizontal and vertical logo arrangements", () => {
    expect(lockup).toContain('orientation?: "horizontal" | "vertical"');
    expect(lockup).toContain("layoutStyles");
  });

  it("uses a single width value to scale the whole lockup", () => {
    expect(lockup).toContain("style={{ width: toCssWidth(width) }}");
  });

  it("accepts a color prop for the svg masks", () => {
    expect(lockup).toContain("color?: string");
    expect(lockup).toContain("backgroundColor: color");
    expect(lockup).toContain("maskImage");
  });

  it("uses the split logo SVG assets", () => {
    expect(lockup).toContain("/brand/logo-dragonfly.svg");
    expect(lockup).toContain("/brand/logo-text.svg");
  });

  it("renders the vertical lockup in the footer", () => {
    expect(footer).toContain("BrandLogoLockup");
    expect(footer).toContain('orientation="vertical"');
  });
});
