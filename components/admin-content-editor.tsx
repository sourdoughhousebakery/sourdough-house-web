"use client";

import { Check, ImageIcon, Megaphone, MessageSquareQuote, Plus, Trash2, Upload, UserRoundCog } from "lucide-react";
import { useEffect, useState } from "react";
import type { AdminDataSource } from "@/lib/admin-data/types";
import {
  type EditableAdminContent,
  type EditableAnnouncement,
  type EditableContact,
  type EditableHero,
  type EditableTestimonial
} from "@/lib/admin-content/content";

type AdminContentEditorProps = {
  dataSource: AdminDataSource;
  defaultContent: EditableAdminContent;
  activeTab?: AdminContentTab;
  title?: string;
  description?: string;
  showTabs?: boolean;
};

export type AdminContentTab = "hero" | "announcement" | "contact" | "testimonials";

const tabs = [
  { id: "hero" as const, label: "Home Hero", Icon: ImageIcon },
  { id: "announcement" as const, label: "Announcement", Icon: Megaphone },
  { id: "contact" as const, label: "Contact", Icon: UserRoundCog },
  { id: "testimonials" as const, label: "Testimonials", Icon: MessageSquareQuote }
];

export function AdminContentEditor({
  dataSource,
  defaultContent,
  activeTab,
  title = "Site content",
  description = "Manage the content that changes most often.",
  showTabs = true
}: AdminContentEditorProps) {
  const [selectedTab, setSelectedTab] = useState<AdminContentTab>("hero");
  const [content, setContent] = useState(defaultContent);
  const [status, setStatus] = useState("Ready");
  const currentTab = activeTab ?? selectedTab;

  useEffect(() => {
    let isCurrent = true;

    async function loadContent() {
      const [hero, announcement, contact, testimonials] = await Promise.all([
        dataSource.hero.get(),
        dataSource.announcement.get(),
        dataSource.contact.get(),
        dataSource.testimonials.list()
      ]);
      if (!isCurrent) return;
      setContent({ hero, announcement, contact, testimonials });
    }

    loadContent().catch(() => {
      if (isCurrent) setStatus("Could not load content");
    });

    return () => {
      isCurrent = false;
    };
  }, [dataSource]);

  function changeHero(patch: Partial<EditableHero>) {
    setContent((current) => ({
      ...current,
      hero: { ...current.hero, ...patch }
    }));
    setStatus("Unsaved changes");
  }

  async function saveHero() {
    setStatus("Saving...");
    try {
      const hero = await dataSource.hero.update(content.hero);
      setContent((current) => ({ ...current, hero }));
      setStatus("Saved");
    } catch {
      setStatus("Could not save hero");
    }
  }

  async function uploadHeroImage(file: File) {
    setStatus("Preparing image...");
    try {
      const asset = await dataSource.assets.upload(file);
      changeHero({ imageSrc: asset.url });
      setStatus("Image ready. Save hero to publish.");
    } catch {
      setStatus("Could not upload hero image");
    }
  }

  function changeAnnouncement(patch: Partial<EditableAnnouncement>) {
    setContent((current) => ({
      ...current,
      announcement: { ...current.announcement, ...patch }
    }));
    setStatus("Unsaved changes");
  }

  async function saveAnnouncement() {
    setStatus("Saving...");
    try {
      const announcement = await dataSource.announcement.update(content.announcement);
      setContent((current) => ({ ...current, announcement }));
      setStatus("Saved");
    } catch {
      setStatus("Could not save announcement");
    }
  }

  function changeContact(patch: Partial<EditableContact>) {
    setContent((current) => ({
      ...current,
      contact: { ...current.contact, ...patch }
    }));
    setStatus("Unsaved changes");
  }

  async function saveContact() {
    setStatus("Saving...");
    try {
      const contact = await dataSource.contact.update(content.contact);
      setContent((current) => ({ ...current, contact }));
      setStatus("Saved");
    } catch {
      setStatus("Could not save contact");
    }
  }

  async function addTestimonial() {
    setStatus("Saving...");
    try {
      const testimonial = await dataSource.testimonials.create();
      setContent((current) => ({ ...current, testimonials: [...current.testimonials, testimonial] }));
      setStatus("Saved");
    } catch {
      setStatus("Could not add testimonial");
    }
  }

  function changeTestimonial(id: string, patch: Partial<EditableTestimonial>) {
    setContent((current) => ({
      ...current,
      testimonials: current.testimonials.map((testimonial) =>
        testimonial.id === id ? { ...testimonial, ...patch, id: testimonial.id } : testimonial
      )
    }));
    setStatus("Unsaved changes");
  }

  async function saveTestimonial(testimonial: EditableTestimonial) {
    setStatus("Saving...");
    try {
      const updated = await dataSource.testimonials.update(testimonial.id, testimonial);
      setContent((current) => ({
        ...current,
        testimonials: current.testimonials.map((currentTestimonial) => (currentTestimonial.id === testimonial.id ? updated : currentTestimonial))
      }));
      setStatus("Saved");
    } catch {
      setStatus("Could not save testimonial");
    }
  }

  async function deleteTestimonial(id: string) {
    setStatus("Saving...");
    try {
      await dataSource.testimonials.delete(id);
      setContent((current) => ({
        ...current,
        testimonials: current.testimonials.filter((testimonial) => testimonial.id !== id)
      }));
      setStatus("Saved");
    } catch {
      setStatus("Could not delete testimonial");
    }
  }

  return (
    <section className="grid gap-5">
      <div className="rounded-[2rem] border border-rust/15 bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-rust">Site content</p>
            <h2 className="mt-2 font-serif text-3xl text-espresso">{title}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-espresso/68">{description}</p>
            <p className="mt-3 text-sm font-bold text-espresso/60">Edit fields locally, then use each section&apos;s Save button to publish changes through the admin data API.</p>
          </div>
          <p className="text-sm font-bold text-sage lg:pt-2">{status}</p>
        </div>
      </div>

      {showTabs ? (
        <div className="grid gap-4 rounded-[1.5rem] border border-espresso/10 bg-white/70 p-3 shadow-soft md:grid-cols-4">
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setSelectedTab(id)}
              className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-[1.1rem] px-4 text-sm font-black transition ${
                currentTab === id ? "bg-espresso text-cream shadow-soft ring-2 ring-gold/60" : "text-espresso/68 hover:bg-white"
              }`}
              aria-pressed={currentTab === id}
            >
              <Icon aria-hidden size={18} />
              {label}
            </button>
          ))}
        </div>
      ) : null}

      {currentTab === "hero" ? (
        <HeroPanel hero={content.hero} onChange={changeHero} onSave={saveHero} onUploadImage={uploadHeroImage} />
      ) : null}
      {currentTab === "announcement" ? (
        <AnnouncementPanel announcement={content.announcement} onChange={changeAnnouncement} onSave={saveAnnouncement} />
      ) : null}
      {currentTab === "contact" ? <ContactPanel contact={content.contact} onChange={changeContact} onSave={saveContact} /> : null}
      {currentTab === "testimonials" ? (
        <TestimonialsPanel
          testimonials={content.testimonials}
          onAdd={addTestimonial}
          onUpdate={changeTestimonial}
          onSave={saveTestimonial}
          onDelete={deleteTestimonial}
        />
      ) : null}
    </section>
  );
}

function HeroPanel({
  hero,
  onChange,
  onSave,
  onUploadImage
}: {
  hero: EditableHero;
  onChange: (patch: Partial<EditableHero>) => void;
  onSave: () => void;
  onUploadImage: (file: File) => void;
}) {
  return (
    <div className="grid gap-4 rounded-[1.5rem] border border-espresso/10 bg-white p-5 shadow-soft">
      <div className="grid gap-3 md:grid-cols-2">
        <TextInput label="Eyebrow" value={hero.eyebrow} onChange={(value) => onChange({ eyebrow: value })} />
        <TextInput label="Image badge" value={hero.imageBadge} onChange={(value) => onChange({ imageBadge: value })} />
      </div>
      <TextInput label="Headline" value={hero.title} onChange={(value) => onChange({ title: value })} />
      <TextArea label="Subheadline" value={hero.description} onChange={(value) => onChange({ description: value })} />

      <div className="grid gap-3 md:grid-cols-2">
        <TextInput label="Primary button label" value={hero.primaryCtaLabel} onChange={(value) => onChange({ primaryCtaLabel: value })} />
        <TextInput label="Primary button URL" value={hero.primaryCtaUrl} onChange={(value) => onChange({ primaryCtaUrl: value })} />
        <TextInput label="Secondary button label" value={hero.secondaryCtaLabel} onChange={(value) => onChange({ secondaryCtaLabel: value })} />
        <TextInput label="Secondary button URL" value={hero.secondaryCtaUrl} onChange={(value) => onChange({ secondaryCtaUrl: value })} />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <TextInput label="First highlight" value={hero.firstHighlight} onChange={(value) => onChange({ firstHighlight: value })} />
        <TextInput label="Second highlight" value={hero.secondHighlight} onChange={(value) => onChange({ secondHighlight: value })} />
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_1fr]">
        <TextInput label="Image URL" value={hero.imageSrc} onChange={(value) => onChange({ imageSrc: value })} />
        <TextInput label="Image alt text" value={hero.imageAlt} onChange={(value) => onChange({ imageAlt: value })} />
      </div>
      <label className="grid gap-2 text-xs font-black uppercase tracking-[0.12em] text-rust">
        Upload hero image
        <span className="text-sm font-semibold normal-case leading-6 tracking-normal text-espresso/60">
          Use a hosted image URL above, or upload a local image. Save the hero after uploading.
        </span>
        <span className="inline-flex min-h-11 w-fit cursor-pointer items-center justify-center gap-2 rounded-full border border-espresso/15 bg-white px-5 text-sm font-black normal-case tracking-normal text-espresso hover:border-rust/30 hover:text-rust">
          <Upload aria-hidden size={16} />
          Choose image file
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.currentTarget.value = "";
              if (!file) return;
              onUploadImage(file);
            }}
          />
        </span>
      </label>

      <TextInput label="Image note" value={hero.imageNote} onChange={(value) => onChange({ imageNote: value })} />

      <div>
        <button
          type="button"
          onClick={onSave}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-6 text-sm font-black text-espresso shadow-soft transition active:translate-y-px"
        >
          Save hero
        </button>
      </div>
    </div>
  );
}

function AnnouncementPanel({
  announcement,
  onChange,
  onSave
}: {
  announcement: EditableAnnouncement;
  onChange: (patch: Partial<EditableAnnouncement>) => void;
  onSave: () => void;
}) {
  return (
    <div className="grid gap-4 rounded-[1.5rem] border border-espresso/10 bg-white p-5 shadow-soft">
      <ToggleButton label="Show announcement" pressed={announcement.isActive} onChange={(pressed) => onChange({ isActive: pressed })} />
      <div className="grid gap-3 md:grid-cols-2">
        <TextInput label="Title" value={announcement.title} onChange={(value) => onChange({ title: value })} />
        <TextInput label="Button label" value={announcement.ctaLabel} onChange={(value) => onChange({ ctaLabel: value })} />
      </div>
      <TextInput label="Button URL" value={announcement.ctaUrl} onChange={(value) => onChange({ ctaUrl: value })} />
      <TextArea label="Message" value={announcement.body} onChange={(value) => onChange({ body: value })} />
      <div>
        <button
          type="button"
          onClick={onSave}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-6 text-sm font-black text-espresso shadow-soft transition active:translate-y-px"
        >
          Save announcement
        </button>
      </div>
    </div>
  );
}

function ContactPanel({
  contact,
  onChange,
  onSave
}: {
  contact: EditableContact;
  onChange: (patch: Partial<EditableContact>) => void;
  onSave: () => void;
}) {
  return (
    <div className="grid gap-4 rounded-[1.5rem] border border-espresso/10 bg-white p-5 shadow-soft">
      <div className="grid gap-3 md:grid-cols-2">
        <TextInput label="Email" value={contact.email} onChange={(value) => onChange({ email: value })} />
        <TextInput label="Pickup area" value={contact.pickupArea} onChange={(value) => onChange({ pickupArea: value })} />
      </div>
      <TextInput label="Instagram URL" value={contact.instagramUrl} onChange={(value) => onChange({ instagramUrl: value })} />
      <TextInput label="Facebook URL" value={contact.facebookUrl} onChange={(value) => onChange({ facebookUrl: value })} />
      <TextInput label="TikTok URL" value={contact.tiktokUrl} onChange={(value) => onChange({ tiktokUrl: value })} />
      <div>
        <button
          type="button"
          onClick={onSave}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-6 text-sm font-black text-espresso shadow-soft transition active:translate-y-px"
        >
          Save contact
        </button>
      </div>
    </div>
  );
}

function TestimonialsPanel({
  testimonials,
  onAdd,
  onUpdate,
  onSave,
  onDelete
}: {
  testimonials: EditableTestimonial[];
  onAdd: () => void;
  onUpdate: (id: string, patch: Partial<EditableTestimonial>) => void;
  onSave: (testimonial: EditableTestimonial) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="grid gap-5">
      <div>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-gold px-5 text-sm font-black text-espresso"
        >
          <Plus aria-hidden size={17} />
          Add testimonial
        </button>
      </div>

      {testimonials.map((testimonial) => (
        <article key={testimonial.id} className="grid gap-4 rounded-[1.5rem] border border-espresso/10 bg-white p-5 shadow-soft">
          <ToggleButton
            label="Show testimonial"
            pressed={testimonial.isActive}
            onChange={(pressed) => onUpdate(testimonial.id, { isActive: pressed })}
          />
          <div className="grid gap-3 md:grid-cols-2">
            <TextInput
              label="Name"
              value={testimonial.name}
              onChange={(value) => onUpdate(testimonial.id, { name: value })}
            />
            <TextInput
              label="Source"
              value={testimonial.source}
              onChange={(value) => onUpdate(testimonial.id, { source: value })}
            />
          </div>
          <TextArea
            label="Quote"
            value={testimonial.quote}
            onChange={(value) => onUpdate(testimonial.id, { quote: value })}
          />
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onSave(testimonial)}
              className="inline-flex min-h-10 items-center justify-center rounded-full bg-gold px-5 text-sm font-black text-espresso shadow-soft transition active:translate-y-px"
            >
              Save testimonial
            </button>
            <button
              type="button"
              onClick={() => onDelete(testimonial.id)}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-rust/20 bg-rust/8 px-5 text-sm font-black text-rust transition hover:bg-rust/12 active:translate-y-px"
            >
              <Trash2 aria-hidden size={16} />
              Delete testimonial
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function ToggleButton({
  label,
  pressed,
  onChange
}: {
  label: string;
  pressed: boolean;
  onChange: (pressed: boolean) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={() => onChange(!pressed)}
      className={`inline-flex min-h-11 w-fit items-center justify-between gap-3 rounded-full border px-4 text-sm font-black transition active:translate-y-px ${
        pressed
          ? "border-espresso bg-espresso text-cream shadow-soft"
          : "border-espresso/15 bg-white text-espresso/68 hover:border-rust/30 hover:text-rust"
      }`}
    >
      <span>{label}</span>
      <span
        className={`inline-flex size-6 items-center justify-center rounded-full ${
          pressed ? "bg-gold text-espresso" : "border border-espresso/18 bg-cream text-transparent"
        }`}
      >
        <Check aria-hidden size={14} />
      </span>
    </button>
  );
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1 text-xs font-black uppercase tracking-[0.12em] text-rust">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-xl border border-espresso/12 px-3 py-2 text-sm font-semibold normal-case tracking-normal text-espresso"
      />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1 text-xs font-black uppercase tracking-[0.12em] text-rust">
      {label}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-24 rounded-xl border border-espresso/12 px-3 py-2 text-sm font-semibold normal-case leading-6 tracking-normal text-espresso"
      />
    </label>
  );
}
