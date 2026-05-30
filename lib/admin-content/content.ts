import { testimonials } from "@/content/site-content";
import { siteConfig } from "@/lib/site";

export type EditableAnnouncement = {
  title: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
  isActive: boolean;
};

export type EditableContact = {
  email: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  pickupArea: string;
};

export type EditableTestimonial = {
  id: string;
  quote: string;
  name: string;
  source: string;
  isActive: boolean;
};

export type EditableAdminContent = {
  announcement: EditableAnnouncement;
  contact: EditableContact;
  testimonials: EditableTestimonial[];
};

export type PersistedAdminContent = {
  announcement?: Partial<EditableAnnouncement>;
  contact?: Partial<EditableContact>;
  testimonials?: EditableTestimonial[];
};

export const adminContentStorageKey = "sourdough-house-admin-content";

export function getDefaultAdminContent(): EditableAdminContent {
  return {
    announcement: {
      title: "",
      body: "",
      ctaLabel: "",
      ctaUrl: "",
      isActive: false
    },
    contact: {
      email: siteConfig.email,
      instagramUrl: siteConfig.instagramUrl,
      facebookUrl: siteConfig.facebookUrl,
      tiktokUrl: siteConfig.tiktokUrl,
      pickupArea: siteConfig.pickupArea
    },
    testimonials: testimonials.map((testimonial, index) => ({
      id: `testimonial-${index + 1}`,
      quote: testimonial.quote,
      name: testimonial.name,
      source: testimonial.source,
      isActive: true
    }))
  };
}

export function hydrateAdminContent(
  defaults: EditableAdminContent,
  persisted: PersistedAdminContent
): EditableAdminContent {
  return {
    announcement: {
      ...defaults.announcement,
      ...persisted.announcement
    },
    contact: {
      ...defaults.contact,
      ...persisted.contact
    },
    testimonials: Array.isArray(persisted.testimonials) ? persisted.testimonials : defaults.testimonials
  };
}

export function createEditableTestimonial(testimonials: EditableTestimonial[]): EditableTestimonial[] {
  return [
    ...testimonials,
    {
      id: `testimonial-${Date.now().toString(36)}`,
      quote: "Customer quote",
      name: "Customer name",
      source: "Customer",
      isActive: true
    }
  ];
}

export function updateEditableTestimonial(
  testimonials: EditableTestimonial[],
  id: string,
  patch: Partial<EditableTestimonial>
): EditableTestimonial[] {
  return testimonials.map((testimonial) =>
    testimonial.id === id ? { ...testimonial, ...patch, id: testimonial.id } : testimonial
  );
}

export function deleteEditableTestimonial(testimonials: EditableTestimonial[], id: string): EditableTestimonial[] {
  return testimonials.filter((testimonial) => testimonial.id !== id);
}

export function getActiveAnnouncement(announcement: EditableAnnouncement): EditableAnnouncement | null {
  if (!announcement.isActive) return null;
  if (!announcement.title.trim() || !announcement.body.trim()) return null;
  return announcement;
}

export function getActiveTestimonials(testimonials: EditableTestimonial[]): EditableTestimonial[] {
  return testimonials.filter((testimonial) => testimonial.isActive && testimonial.quote.trim() && testimonial.name.trim());
}
