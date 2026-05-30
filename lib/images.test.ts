import { describe, expect, it } from "vitest";
import { isDataImageSrc } from "./images";

describe("isDataImageSrc", () => {
  it("accepts browser-uploaded image data URLs", () => {
    expect(isDataImageSrc("data:image/png;base64,abc123")).toBe(true);
  });

  it("ignores leading spacing around the source", () => {
    expect(isDataImageSrc("  data:image/jpeg;base64,abc123")).toBe(true);
  });

  it("rejects hosted URLs and non-image data URLs", () => {
    expect(isDataImageSrc("https://example.com/bread.jpg")).toBe(false);
    expect(isDataImageSrc("data:text/plain;base64,abc123")).toBe(false);
  });
});
