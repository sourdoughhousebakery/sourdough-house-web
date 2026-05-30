import { describe, expect, it } from "vitest";
import {
  createEditableTestimonial,
  deleteEditableTestimonial,
  getActiveAnnouncement,
  getActiveTestimonials,
  getDefaultAdminContent,
  hydrateAdminContent,
  updateEditableTestimonial
} from "./content";

describe("getDefaultAdminContent", () => {
  it("builds editable defaults from current site content", () => {
    const content = getDefaultAdminContent();

    expect(content.announcement).toMatchObject({
      title: "",
      body: "",
      isActive: false
    });
    expect(content.hero).toMatchObject({
      title: "Bread baked with love and patience.",
      imageBadge: "Fresh this week",
      imageNote: "Starter-fed, hand-shaped, baked to share"
    });
    expect(content.contact.email).toBe("hello@sourdoughhouse.com");
    expect(content.testimonials).toHaveLength(2);
    expect(content.testimonials[0]).toMatchObject({
      quote: "The best bread I have ever had. You can taste the time and care in every slice.",
      isActive: true
    });
  });
});

describe("hydrateAdminContent", () => {
  it("merges persisted partial content over defaults", () => {
    const defaults = getDefaultAdminContent();
    const hydrated = hydrateAdminContent(defaults, {
      announcement: {
        title: "Friday drop",
        body: "Orders open at 9am.",
        isActive: true
      },
      contact: {
        email: "orders@example.com"
      },
      hero: {
        title: "Holiday bread is here",
        imageBadge: "Preorder now"
      }
    });

    expect(hydrated.announcement).toMatchObject({
      title: "Friday drop",
      body: "Orders open at 9am.",
      ctaLabel: "",
      ctaUrl: "",
      isActive: true
    });
    expect(hydrated.contact.email).toBe("orders@example.com");
    expect(hydrated.contact.pickupArea).toBe(defaults.contact.pickupArea);
    expect(hydrated.hero.title).toBe("Holiday bread is here");
    expect(hydrated.hero.imageBadge).toBe("Preorder now");
    expect(hydrated.hero.imageNote).toBe(defaults.hero.imageNote);
    expect(hydrated.testimonials).toEqual(defaults.testimonials);
  });
});

describe("testimonial helpers", () => {
  it("creates a testimonial with editable defaults", () => {
    const testimonials = createEditableTestimonial([]);

    expect(testimonials).toHaveLength(1);
    expect(testimonials[0]).toMatchObject({
      quote: "Customer quote",
      name: "Customer name",
      source: "Customer",
      isActive: true
    });
    expect(testimonials[0]?.id).toMatch(/^testimonial-/);
  });

  it("updates a testimonial by id", () => {
    const [testimonial] = getDefaultAdminContent().testimonials;
    const updated = updateEditableTestimonial([testimonial], testimonial.id, { name: "Updated" });

    expect(updated[0]?.name).toBe("Updated");
    expect(updated[0]?.id).toBe(testimonial.id);
  });

  it("deletes a testimonial by id", () => {
    const testimonials = getDefaultAdminContent().testimonials;

    expect(deleteEditableTestimonial(testimonials, testimonials[0].id)).toHaveLength(testimonials.length - 1);
  });
});

describe("public content selectors", () => {
  it("returns only complete active announcements", () => {
    expect(
      getActiveAnnouncement({
        title: "Friday drop",
        body: "Orders open at 9am.",
        ctaLabel: "",
        ctaUrl: "",
        isActive: true
      })
    ).toMatchObject({ title: "Friday drop" });

    expect(
      getActiveAnnouncement({
        title: "Incomplete",
        body: "",
        ctaLabel: "",
        ctaUrl: "",
        isActive: true
      })
    ).toBeNull();
  });

  it("returns only active testimonials", () => {
    const testimonials = getDefaultAdminContent().testimonials;

    expect(getActiveTestimonials(updateEditableTestimonial(testimonials, testimonials[0].id, { isActive: false }))).toEqual([
      testimonials[1]
    ]);
  });
});
