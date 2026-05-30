import { describe, expect, it } from "vitest";
import {
  createEditableTestimonial,
  deleteEditableTestimonial,
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
