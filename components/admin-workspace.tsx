"use client";

import { Megaphone, MessageSquareQuote, ShoppingBag, UserRoundCog } from "lucide-react";
import { useState } from "react";
import type { EditableAdminContent } from "@/lib/admin-content/content";
import type { BakeCatalogItem } from "@/lib/catalog/types";
import { AdminCatalogEditor } from "./admin-catalog-editor";
import { AdminContentEditor, type AdminContentTab } from "./admin-content-editor";

type AdminWorkspaceProps = {
  defaultCatalogItems: BakeCatalogItem[];
  defaultContent: EditableAdminContent;
};

type AdminSectionId = "catalog" | AdminContentTab;

const adminSections = [
  {
    id: "catalog" as const,
    label: "Menu & Catalog",
    eyebrow: "Menu",
    title: "Edit bakery items.",
    description:
      "Use this for breads, sweets, specials, prices, photos, and featured items. This is the section you will use most often.",
    Icon: ShoppingBag
  },
  {
    id: "announcement" as const,
    label: "Announcement",
    eyebrow: "Status",
    title: "Post a short site notice.",
    description:
      "Use this for temporary updates like orders opening, sold out notices, pickup changes, or holiday preorders.",
    Icon: Megaphone
  },
  {
    id: "contact" as const,
    label: "Contact",
    eyebrow: "Business info",
    title: "Update contact details.",
    description:
      "Use this when the email, pickup area, or social profile links change. Generic social links are hidden from the public site.",
    Icon: UserRoundCog
  },
  {
    id: "testimonials" as const,
    label: "Testimonials",
    eyebrow: "Reviews",
    title: "Choose customer quotes.",
    description:
      "Use this to add, hide, or update the customer quote shown on the homepage.",
    Icon: MessageSquareQuote
  }
];

export function AdminWorkspace({ defaultCatalogItems, defaultContent }: AdminWorkspaceProps) {
  const [activeSection, setActiveSection] = useState<AdminSectionId>("catalog");
  const section = adminSections.find((item) => item.id === activeSection) ?? adminSections[0];

  return (
    <div className="mx-auto grid max-w-6xl gap-6">
      <div className="rounded-[2rem] border border-espresso/10 bg-white p-5 shadow-soft">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-rust">Admin preview</p>
        <h2 className="mt-2 font-serif text-3xl text-espresso">Pick one thing to edit.</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-espresso/68">
          Choose a tab, make changes, then use that section&apos;s Save local preview button. These previews are saved only in this browser until a shared database is connected.
        </p>
      </div>

      <div className="grid gap-3 rounded-[1.5rem] border border-espresso/10 bg-white/70 p-3 shadow-soft md:grid-cols-4">
        {adminSections.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveSection(id)}
            className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-[1.1rem] px-4 text-sm font-black transition ${
              activeSection === id ? "bg-espresso text-cream" : "text-espresso/68 hover:bg-white"
            }`}
            aria-pressed={activeSection === id}
          >
            <Icon aria-hidden size={18} />
            {label}
          </button>
        ))}
      </div>

      <div className="rounded-[1.5rem] border border-gold/20 bg-gold/10 p-5">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-rust">{section.eyebrow}</p>
        <h3 className="mt-2 font-serif text-3xl text-espresso">{section.title}</h3>
        <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-espresso/68">{section.description}</p>
      </div>

      {activeSection === "catalog" ? (
        <AdminCatalogEditor
          defaultItems={defaultCatalogItems}
          title="Menu and catalog"
          description="Edit the items customers see in the What we bake menu preview. Use Feature on home for the items you want highlighted on the homepage."
        />
      ) : (
        <AdminContentEditor
          defaultContent={defaultContent}
          activeTab={activeSection}
          showTabs={false}
          title={section.title}
          description={section.description}
        />
      )}
    </div>
  );
}
