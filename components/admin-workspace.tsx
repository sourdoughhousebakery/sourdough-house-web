"use client";

import { ImageIcon, Megaphone, MessageSquareQuote, ShoppingBag, UserRoundCog } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import type { EditableAdminContent } from "@/lib/admin-content/content";
import { HttpAdminDataSource } from "@/lib/admin-data/http";
import type { BakeCatalogItem } from "@/lib/catalog/types";
import { AdminCatalogEditor } from "./admin-catalog-editor";
import { AdminContentEditor, type AdminContentTab } from "./admin-content-editor";
import { AdminToastStack, type AdminToast, type AdminToastInput } from "./admin-toast";

type AdminWorkspaceProps = {
  defaultCatalogItems: BakeCatalogItem[];
  defaultContent: EditableAdminContent;
};

type AdminSectionId = "catalog" | AdminContentTab;

const adminSections = [
  {
    id: "hero" as const,
    label: "Home Hero",
    eyebrow: "Homepage",
    title: "Update the first screen.",
    description:
      "Use this for the hero headline, buttons, image, badge, and short image note shown at the top of the homepage.",
    Icon: ImageIcon
  },
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
  const [toasts, setToasts] = useState<AdminToast[]>([]);
  const nextToastId = useRef(0);
  const dataSource = useMemo(() => new HttpAdminDataSource(), []);
  const section = adminSections.find((item) => item.id === activeSection) ?? adminSections[0];

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notifyAdmin = useCallback((toast: AdminToastInput) => {
    const id = nextToastId.current + 1;
    nextToastId.current = id;
    setToasts((current) => [...current.slice(-2), { ...toast, id }]);
    window.setTimeout(() => dismissToast(id), 5000);
  }, [dismissToast]);

  return (
    <div className="mx-auto grid max-w-6xl gap-6">
      <AdminToastStack toasts={toasts} onDismiss={dismissToast} />
      <div className="rounded-[2rem] border border-espresso/10 bg-white p-5 shadow-soft">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-rust">Admin preview</p>
        <h2 className="mt-2 font-serif text-3xl text-espresso">Pick one thing to edit.</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-espresso/68">
          Choose a tab and make changes. The admin uses a data API, so this screen can move from browser-local data to a shared backend later without changing the editor workflow.
        </p>
      </div>

      <div className="grid gap-3 rounded-[1.5rem] border border-espresso/10 bg-white/70 p-3 shadow-soft md:grid-cols-5">
        {adminSections.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveSection(id)}
            className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-[1.1rem] px-4 text-sm font-black transition ${
              activeSection === id ? "bg-espresso text-cream shadow-soft ring-2 ring-gold/60" : "text-espresso/68 hover:bg-white"
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
          dataSource={dataSource}
          defaultItems={defaultCatalogItems}
          title="Menu and catalog"
          description="Edit the items customers see in the What we bake menu preview. Use Feature on home for the items you want highlighted on the homepage."
          onNotify={notifyAdmin}
        />
      ) : (
        <AdminContentEditor
          dataSource={dataSource}
          defaultContent={defaultContent}
          activeTab={activeSection}
          showTabs={false}
          title={section.title}
          description={section.description}
          onNotify={notifyAdmin}
        />
      )}
    </div>
  );
}
