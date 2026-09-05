import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const hero = readFileSync("components/hero.tsx", "utf8");

describe("homepage hero", () => {
  it("pairs the brand logo with the editable headline and calls to action", () => {
    expect(hero).toContain("BrandLogoLockup");
    expect(hero).toContain('width="clamp(180px, 25vw, 360px)"');
    expect(hero).toContain("content.eyebrow");
    expect(hero).toContain("content.title");
  });
});
