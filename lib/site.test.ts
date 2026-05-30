import { describe, expect, it } from "vitest";
import { getContactLinks, getSocialLinks, siteConfig } from "./site";

describe("getSocialLinks", () => {
  it("omits placeholder platform URLs", () => {
    expect(getSocialLinks(siteConfig).map((link) => link.label)).toEqual([]);
  });

  it("keeps configured profile URLs", () => {
    expect(
      getSocialLinks({
        ...siteConfig,
        instagramUrl: "https://www.instagram.com/sourdoughhouse/"
      })
    ).toEqual([{ label: "Instagram", href: "https://www.instagram.com/sourdoughhouse" }]);
  });

  it("normalizes social URLs for app-friendly universal links", () => {
    expect(
      getSocialLinks({
        ...siteConfig,
        instagramUrl: "instagram.com/sourdoughhouse",
        facebookUrl: "https://facebook.com/sourdoughhouse/",
        tiktokUrl: "https://www.tiktok.com/sourdoughhouse"
      })
    ).toEqual([
      { label: "Instagram", href: "https://www.instagram.com/sourdoughhouse" },
      { label: "Facebook", href: "https://www.facebook.com/sourdoughhouse" },
      { label: "TikTok", href: "https://www.tiktok.com/@sourdoughhouse" }
    ]);
  });
});

describe("getContactLinks", () => {
  it("always includes email when configured", () => {
    expect(getContactLinks(siteConfig)).toContainEqual({
      label: siteConfig.email,
      href: `mailto:${siteConfig.email}`,
      kind: "email"
    });
  });
});
