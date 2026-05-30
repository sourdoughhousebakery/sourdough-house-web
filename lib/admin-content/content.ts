import { heroContent, testimonials } from "@/content/site-content";
import { getHotplateUrl, siteConfig } from "@/lib/site";

export type EditableHero = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaUrl: string;
  secondaryCtaLabel: string;
  secondaryCtaUrl: string;
  firstHighlight: string;
  secondHighlight: string;
  imageSrc: string;
  imageAlt: string;
  imageBadge: string;
  imageNote: string;
};

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
  hero: EditableHero;
  announcement: EditableAnnouncement;
  contact: EditableContact;
  testimonials: EditableTestimonial[];
};

export type PersistedAdminContent = {
  hero?: Partial<EditableHero>;
  announcement?: Partial<EditableAnnouncement>;
  contact?: Partial<EditableContact>;
  testimonials?: EditableTestimonial[];
};

export const adminContentStorageKey = "sourdough-house-admin-content";
export const adminContentChangeEvent = "sourdough-house-admin-content-change";

export function getDefaultAdminContent(): EditableAdminContent {
  return {
    hero: {
      eyebrow: heroContent.eyebrow,
      title: heroContent.title,
      description: heroContent.description,
      primaryCtaLabel: heroContent.primaryCtaLabel,
      primaryCtaUrl: getHotplateUrl(),
      secondaryCtaLabel: heroContent.secondaryCtaLabel,
      secondaryCtaUrl: "/story",
      firstHighlight: heroContent.highlights[0],
      secondHighlight: heroContent.highlights[1],
      imageSrc: heroContent.image.src,
      imageAlt: heroContent.image.alt,
      imageBadge: heroContent.imageBadge,
      imageNote: heroContent.imageNote
    },
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
    hero: {
      ...defaults.hero,
      ...persisted.hero
    },
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
