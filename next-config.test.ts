import { describe, expect, it } from "vitest";
import nextConfig from "./next.config";

describe("next image configuration", () => {
  it("allows Supabase Storage image URLs from the configured project", () => {
    expect(nextConfig.images?.remotePatterns).toContainEqual({
      protocol: "https",
      hostname: "qsbwtmumqifdhckrndiw.supabase.co"
    });
  });
});
