"use client";

import { Megaphone, MessageSquareQuote, Plus, Trash2, UserRoundCog } from "lucide-react";
import { useEffect, useState } from "react";
import type { AdminDataSource } from "@/lib/admin-data/types";
import {
  type EditableAdminContent,
  type EditableAnnouncement,
  type EditableContact,
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

export type AdminContentTab = "announcement" | "contact" | "testimonials";

const tabs = [
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
  const [selectedTab, setSelectedTab] = useState<AdminContentTab>("announcement");
  const [content, setContent] = useState(defaultContent);
  const [status, setStatus] = useState("Ready");
  const currentTab = activeTab ?? selectedTab;

  useEffect(() => {
    let isCurrent = true;

    async function loadContent() {
      const [announcement, contact, testimonials] = await Promise.all([
        dataSource.announcement.get(),
        dataSource.contact.get(),
        dataSource.testimonials.list()
      ]);
      if (!isCurrent) return;
      setContent({ announcement, contact, testimonials });
    }

    loadContent().catch(() => {
      if (isCurrent) setStatus("Could not load content");
    });

    return () => {
      isCurrent = false;
    };
  }, [dataSource]);

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
        <div className="grid gap-4 rounded-[1.5rem] border border-espresso/10 bg-white/70 p-3 shadow-soft md:grid-cols-3">
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setSelectedTab(id)}
              className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-[1.1rem] px-4 text-sm font-black transition ${
                currentTab === id ? "bg-espresso text-cream" : "text-espresso/68 hover:bg-white"
              }`}
            >
              <Icon aria-hidden size={18} />
              {label}
            </button>
          ))}
        </div>
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
      <label className="inline-flex items-center gap-2 text-sm font-bold text-espresso/72">
        <input
          type="checkbox"
          checked={announcement.isActive}
          onChange={(event) => onChange({ isActive: event.target.checked })}
          className="size-4 accent-rust"
        />
        Show announcement
      </label>
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
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-5 text-sm font-black text-espresso"
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
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-5 text-sm font-black text-espresso"
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
          <label className="inline-flex items-center gap-2 text-sm font-bold text-espresso/72">
            <input
              type="checkbox"
              checked={testimonial.isActive}
              onChange={(event) => onUpdate(testimonial.id, { isActive: event.target.checked })}
              className="size-4 accent-rust"
            />
            Show testimonial
          </label>
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
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => onSave(testimonial)}
              className="inline-flex min-h-10 items-center justify-center rounded-full bg-gold px-4 text-sm font-black text-espresso"
            >
              Save testimonial
            </button>
            <button
              type="button"
              onClick={() => onDelete(testimonial.id)}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-rust/20 bg-rust/8 px-4 text-sm font-black text-rust"
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
