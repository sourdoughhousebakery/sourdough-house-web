import { describe, expect, it } from "vitest";
import { homeContent, orderPanelContent, pageIntros, processBandContent, storyPreviewContent } from "./site-content";

describe("page content registry", () => {
  it("exposes editable intros for public pages", () => {
    expect(Object.keys(pageIntros).sort()).toEqual(["admin", "contact", "menu", "order", "story"]);
  });

  it("keeps homepage section copy in named content objects", () => {
    expect(homeContent.featuredMenu.title).toBe("This week's table.");
    expect(storyPreviewContent.title).toContain("starter");
    expect(processBandContent.title).toContain("better bread");
  });

  it("models order steps as serializable content", () => {
    expect(orderPanelContent.steps).toHaveLength(4);
    expect(orderPanelContent.steps[0]).toMatchObject({
      icon: "Bell",
      title: "Watch the drop"
    });
  });
});
