"use client";

import { Facebook, Instagram, Mail, Music2, Star } from "lucide-react";
import { useMemo, useSyncExternalStore } from "react";
import {
  adminContentStorageKey,
  getActiveAnnouncement,
  getActiveTestimonials,
  hydrateAdminContent,
  type EditableAdminContent,
  type PersistedAdminContent
} from "@/lib/admin-content/content";
import { getContactLinks, type ContactLink } from "@/lib/site";
import { ButtonLink } from "./button-link";
import { MotionSection } from "./motion-section";

type AdminPreviewProps = {
  defaultContent: EditableAdminContent;
};

const iconByLabel = {
  Instagram,
  Facebook,
  TikTok: Music2,
  Email: Mail
};

function useAdminPreviewContent(defaultContent: EditableAdminContent) {
  const raw = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("storage", onStoreChange);
      return () => window.removeEventListener("storage", onStoreChange);
    },
    () => window.localStorage.getItem(adminContentStorageKey),
    () => null
  );

  return useMemo(() => {
    if (!raw) return defaultContent;
    try {
      return hydrateAdminContent(defaultContent, JSON.parse(raw) as PersistedAdminContent);
    } catch {
      window.localStorage.removeItem(adminContentStorageKey);
      return defaultContent;
    }
  }, [defaultContent, raw]);
}

function getLinkIcon(link: ContactLink) {
  return link.kind === "email" ? iconByLabel.Email : iconByLabel[link.label];
}

export function AdminPreviewAnnouncement({ defaultContent }: AdminPreviewProps) {
  const content = useAdminPreviewContent(defaultContent);
  const announcement = getActiveAnnouncement(content.announcement);

  if (!announcement) return null;

  return (
    <section className="px-5 py-4">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 rounded-[1.25rem] border border-rust/15 bg-white p-4 shadow-soft md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-rust">{announcement.title}</p>
          <p className="mt-1 text-sm font-semibold leading-6 text-espresso/72">{announcement.body}</p>
        </div>
        {announcement.ctaLabel && announcement.ctaUrl ? (
          <ButtonLink href={announcement.ctaUrl} external={announcement.ctaUrl.startsWith("http")} variant="secondary" className="min-h-10 shrink-0 px-4">
            {announcement.ctaLabel}
          </ButtonLink>
        ) : null}
      </div>
    </section>
  );
}

export function AdminPreviewContactIconLinks({ defaultContent }: AdminPreviewProps) {
  const content = useAdminPreviewContent(defaultContent);
  const links = getContactLinks(content.contact);

  return (
    <>
      {links.map((link) => {
        const Icon = getLinkIcon(link);

        return (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noreferrer" : undefined}
            aria-label={link.label}
            className="inline-flex size-11 items-center justify-center rounded-full bg-white text-espresso shadow-soft transition hover:-translate-y-0.5 hover:text-rust"
          >
            <Icon aria-hidden size={18} />
          </a>
        );
      })}
    </>
  );
}

export function AdminPreviewContactPillLinks({ defaultContent }: AdminPreviewProps) {
  const content = useAdminPreviewContent(defaultContent);
  const links = getContactLinks(content.contact);

  return (
    <>
      {links.map((link) => {
        const Icon = getLinkIcon(link);

        return (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noreferrer" : undefined}
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-espresso shadow-soft transition hover:-translate-y-0.5 hover:text-rust"
          >
            <Icon aria-hidden size={18} />
            {link.label}
          </a>
        );
      })}
    </>
  );
}

export function AdminPreviewTestimonialBand({ defaultContent }: AdminPreviewProps) {
  const content = useAdminPreviewContent(defaultContent);
  const [testimonial] = getActiveTestimonials(content.testimonials);

  if (!testimonial) return null;

  return (
    <MotionSection className="px-5 py-16">
      <div className="mx-auto max-w-5xl text-center">
        <div className="flex justify-center gap-1 text-gold" aria-label="Five star customer rating">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} aria-hidden size={20} fill="currentColor" />
          ))}
        </div>
        <blockquote className="mt-5 font-serif text-3xl italic leading-snug text-espresso md:text-5xl">
          “{testimonial.quote}”
        </blockquote>
        <p className="mt-5 text-sm font-black uppercase tracking-[0.14em] text-rust">
          {testimonial.name} · {testimonial.source}
        </p>
      </div>
    </MotionSection>
  );
}
