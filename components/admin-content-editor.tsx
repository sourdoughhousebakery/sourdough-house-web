"use client";

import { Megaphone, MessageSquareQuote, Plus, RotateCcw, Save, Trash2, UserRoundCog } from "lucide-react";
import { useState } from "react";
import {
  createEditableTestimonial,
  adminContentStorageKey,
  deleteEditableTestimonial,
  hydrateAdminContent,
  updateEditableTestimonial,
  type EditableAdminContent,
  type EditableAnnouncement,
  type EditableContact,
  type PersistedAdminContent
} from "@/lib/admin-content/content";

type AdminContentEditorProps = {
  defaultContent: EditableAdminContent;
};

type AdminContentTab = "announcement" | "contact" | "testimonials";

const tabs = [
  { id: "announcement" as const, label: "Announcement", Icon: Megaphone },
  { id: "contact" as const, label: "Contact", Icon: UserRoundCog },
  { id: "testimonials" as const, label: "Testimonials", Icon: MessageSquareQuote }
];

export function AdminContentEditor({ defaultContent }: AdminContentEditorProps) {
  const [activeTab, setActiveTab] = useState<AdminContentTab>("announcement");
  const [content, setContent] = useState<EditableAdminContent>(() => {
    if (typeof window === "undefined") return defaultContent;
    const raw = window.localStorage.getItem(adminContentStorageKey);
    if (!raw) return defaultContent;

    try {
      return hydrateAdminContent(defaultContent, JSON.parse(raw) as PersistedAdminContent);
    } catch {
      window.localStorage.removeItem(adminContentStorageKey);
      return defaultContent;
    }
  });
  const [savedAt, setSavedAt] = useState<string | null>(null);

  function updateAnnouncement(patch: Partial<EditableAnnouncement>) {
    setContent((current) => ({
      ...current,
      announcement: { ...current.announcement, ...patch }
    }));
    setSavedAt(null);
  }

  function updateContact(patch: Partial<EditableContact>) {
    setContent((current) => ({
      ...current,
      contact: { ...current.contact, ...patch }
    }));
    setSavedAt(null);
  }

  function save() {
    window.localStorage.setItem(adminContentStorageKey, JSON.stringify(content));
    setSavedAt(new Date().toLocaleTimeString());
  }

  function reset() {
    window.localStorage.removeItem(adminContentStorageKey);
    setContent(defaultContent);
    setSavedAt(null);
  }

  return (
    <section className="grid gap-5">
      <div className="rounded-[2rem] border border-rust/15 bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-rust">Site content</p>
            <h2 className="mt-2 font-serif text-3xl text-espresso">Edit the practical stuff.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-espresso/68">
              Manage the content that changes most often. These changes are saved in this browser only until the shared database admin is connected.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={save}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-espresso px-5 text-sm font-black text-cream"
            >
              <Save aria-hidden size={17} />
              Save local preview
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-espresso/15 bg-white px-5 text-sm font-black text-espresso"
            >
              <RotateCcw aria-hidden size={17} />
              Reset
            </button>
          </div>
        </div>
        {savedAt ? <p className="mt-4 text-sm font-bold text-sage">Saved locally at {savedAt}</p> : null}
      </div>

      <div className="grid gap-4 rounded-[1.5rem] border border-espresso/10 bg-white/70 p-3 shadow-soft md:grid-cols-3">
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-[1.1rem] px-4 text-sm font-black transition ${
              activeTab === id ? "bg-espresso text-cream" : "text-espresso/68 hover:bg-white"
            }`}
          >
            <Icon aria-hidden size={18} />
            {label}
          </button>
        ))}
      </div>

      {activeTab === "announcement" ? (
        <AnnouncementPanel announcement={content.announcement} onChange={updateAnnouncement} />
      ) : null}
      {activeTab === "contact" ? <ContactPanel contact={content.contact} onChange={updateContact} /> : null}
      {activeTab === "testimonials" ? (
        <TestimonialsPanel content={content} setContent={setContent} setSavedAt={setSavedAt} />
      ) : null}
    </section>
  );
}

function AnnouncementPanel({
  announcement,
  onChange
}: {
  announcement: EditableAnnouncement;
  onChange: (patch: Partial<EditableAnnouncement>) => void;
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
    </div>
  );
}

function ContactPanel({
  contact,
  onChange
}: {
  contact: EditableContact;
  onChange: (patch: Partial<EditableContact>) => void;
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
    </div>
  );
}

function TestimonialsPanel({
  content,
  setContent,
  setSavedAt
}: {
  content: EditableAdminContent;
  setContent: (update: (current: EditableAdminContent) => EditableAdminContent) => void;
  setSavedAt: (value: string | null) => void;
}) {
  return (
    <div className="grid gap-5">
      <div>
        <button
          type="button"
          onClick={() => {
            setContent((current) => ({
              ...current,
              testimonials: createEditableTestimonial(current.testimonials)
            }));
            setSavedAt(null);
          }}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-gold px-5 text-sm font-black text-espresso"
        >
          <Plus aria-hidden size={17} />
          Add testimonial
        </button>
      </div>

      {content.testimonials.map((testimonial) => (
        <article key={testimonial.id} className="grid gap-4 rounded-[1.5rem] border border-espresso/10 bg-white p-5 shadow-soft">
          <label className="inline-flex items-center gap-2 text-sm font-bold text-espresso/72">
            <input
              type="checkbox"
              checked={testimonial.isActive}
              onChange={(event) => {
                setContent((current) => ({
                  ...current,
                  testimonials: updateEditableTestimonial(current.testimonials, testimonial.id, {
                    isActive: event.target.checked
                  })
                }));
                setSavedAt(null);
              }}
              className="size-4 accent-rust"
            />
            Show testimonial
          </label>
          <div className="grid gap-3 md:grid-cols-2">
            <TextInput
              label="Name"
              value={testimonial.name}
              onChange={(value) => {
                setContent((current) => ({
                  ...current,
                  testimonials: updateEditableTestimonial(current.testimonials, testimonial.id, { name: value })
                }));
                setSavedAt(null);
              }}
            />
            <TextInput
              label="Source"
              value={testimonial.source}
              onChange={(value) => {
                setContent((current) => ({
                  ...current,
                  testimonials: updateEditableTestimonial(current.testimonials, testimonial.id, { source: value })
                }));
                setSavedAt(null);
              }}
            />
          </div>
          <TextArea
            label="Quote"
            value={testimonial.quote}
            onChange={(value) => {
              setContent((current) => ({
                ...current,
                testimonials: updateEditableTestimonial(current.testimonials, testimonial.id, { quote: value })
              }));
              setSavedAt(null);
            }}
          />
          <div>
            <button
              type="button"
              onClick={() => {
                setContent((current) => ({
                  ...current,
                  testimonials: deleteEditableTestimonial(current.testimonials, testimonial.id)
                }));
                setSavedAt(null);
              }}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-rust/20 bg-rust/8 px-4 text-sm font-black text-rust"
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
