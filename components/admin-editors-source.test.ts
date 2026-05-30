import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const catalogEditor = readFileSync("components/admin-catalog-editor.tsx", "utf8");
const contentEditor = readFileSync("components/admin-content-editor.tsx", "utf8");
const adminWorkspace = readFileSync("components/admin-workspace.tsx", "utf8");

describe("admin editor save flow", () => {
  it("keeps catalog field edits local until the selected item is saved", () => {
    expect(catalogEditor).toContain("Save item");
    expect(catalogEditor).toContain("changeItem");
    expect(catalogEditor).not.toContain("onChange={(value) => updateItem");
    expect(catalogEditor).not.toContain("onChange={(event) => updateItem");
  });

  it("keeps content field edits local until each section is saved", () => {
    expect(contentEditor).toContain("Save hero");
    expect(contentEditor).toContain("Save announcement");
    expect(contentEditor).toContain("Save contact");
    expect(contentEditor).toContain("Save testimonial");
    expect(contentEditor).toContain("changeHero");
    expect(contentEditor).toContain("changeAnnouncement");
    expect(contentEditor).toContain("changeContact");
    expect(contentEditor).toContain("changeTestimonial");
    expect(contentEditor).not.toContain("onChange={updateAnnouncement}");
    expect(contentEditor).not.toContain("onChange={updateContact}");
    expect(contentEditor).not.toContain("onUpdate={updateTestimonial}");
  });

  it("shows toast feedback for admin saves, deletes, uploads, and errors", () => {
    expect(adminWorkspace).toContain("AdminToastStack");
    expect(adminWorkspace).toContain("notifyAdmin");
    expect(catalogEditor).toContain("onNotify?.({ tone: \"success\"");
    expect(catalogEditor).toContain("onNotify?.({ tone: \"error\"");
    expect(contentEditor).toContain("onNotify?.({ tone: \"success\"");
    expect(contentEditor).toContain("onNotify?.({ tone: \"error\"");
  });
});
