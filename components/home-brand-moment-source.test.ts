import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const page = readFileSync("app/page.tsx", "utf8");
const brandMoment = readFileSync("components/home-brand-moment.tsx", "utf8");

describe("home brand moment", () => {
  it("is not mounted on the homepage while the hero layout is being tested", () => {
    expect(page).toContain("<Hero content={hero} />");
    expect(page).not.toContain("<HomeBrandMoment />");
  });

  it("renders a large centered brand lockup", () => {
    expect(brandMoment).toContain("BrandLogoLockup");
    expect(brandMoment).toContain('width="clamp(220px, 28vw, 360px)"');
    expect(brandMoment).toContain('color="#5a4639"');
  });
});
