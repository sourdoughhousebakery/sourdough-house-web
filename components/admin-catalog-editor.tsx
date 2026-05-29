"use client";

import { RotateCcw, Save } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import type { BakeCatalogItem, PublicCatalogItem } from "@/lib/catalog/types";
import { getPublicCatalogItems } from "@/lib/catalog/catalog";

type AdminCatalogEditorProps = {
  defaultItems: BakeCatalogItem[];
};

const storageKey = "sourdough-house-bake-catalog";

function toPublicItems(items: BakeCatalogItem[]): PublicCatalogItem[] {
  return getPublicCatalogItems(items);
}

export function AdminCatalogEditor({ defaultItems }: AdminCatalogEditorProps) {
  const [items, setItems] = useState<BakeCatalogItem[]>(() => {
    if (typeof window === "undefined") return defaultItems;
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return defaultItems;

    try {
      const publicItems = JSON.parse(raw) as PublicCatalogItem[];
      if (!Array.isArray(publicItems)) return defaultItems;
      return defaultItems.map((defaultItem) => {
        const stored = publicItems.find((item) => item.id === defaultItem.id);
        return stored ? { ...defaultItem, ...stored } : defaultItem;
      });
    } catch {
      window.localStorage.removeItem(storageKey);
      return defaultItems;
    }
  });
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const publicItems = useMemo(() => toPublicItems(items), [items]);

  function updateItem(id: string, patch: Partial<BakeCatalogItem>) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function save() {
    window.localStorage.setItem(storageKey, JSON.stringify(publicItems));
    setSavedAt(new Date().toLocaleTimeString());
  }

  function reset() {
    window.localStorage.removeItem(storageKey);
    setItems(defaultItems);
    setSavedAt(null);
  }

  return (
    <div className="grid gap-8">
      <div className="rounded-[2rem] border border-rust/15 bg-white p-5 shadow-soft">
        <h2 className="font-serif text-3xl text-espresso">Placeholder editor</h2>
        <p className="mt-3 text-sm leading-6 text-espresso/68">
          This admin screen saves changes to this browser only. It is the shape of the future Supabase admin, but it is not a secure shared CMS yet.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
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
          {savedAt ? <p className="self-center text-sm font-bold text-sage">Saved locally at {savedAt}</p> : null}
        </div>
      </div>

      <div className="grid gap-5">
        {items.map((item) => (
          <article key={item.id} className="grid gap-5 rounded-[1.5rem] border border-espresso/10 bg-white p-4 shadow-soft md:grid-cols-[180px_1fr]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1rem] bg-gold/10 md:aspect-auto">
              <Image src={item.image} alt="" fill sizes="180px" className="object-cover" />
            </div>
            <div className="grid gap-4">
              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-1 text-xs font-black uppercase tracking-[0.12em] text-rust">
                  Name
                  <input
                    value={item.name}
                    onChange={(event) => updateItem(item.id, { name: event.target.value })}
                    className="rounded-xl border border-espresso/12 px-3 py-2 text-sm font-semibold normal-case tracking-normal text-espresso"
                  />
                </label>
                <label className="grid gap-1 text-xs font-black uppercase tracking-[0.12em] text-rust">
                  Price
                  <input
                    value={item.price}
                    onChange={(event) => updateItem(item.id, { price: event.target.value })}
                    className="rounded-xl border border-espresso/12 px-3 py-2 text-sm font-semibold normal-case tracking-normal text-espresso"
                  />
                </label>
              </div>
              <label className="grid gap-1 text-xs font-black uppercase tracking-[0.12em] text-rust">
                Description
                <textarea
                  value={item.description}
                  onChange={(event) => updateItem(item.id, { description: event.target.value })}
                  className="min-h-24 rounded-xl border border-espresso/12 px-3 py-2 text-sm font-semibold normal-case leading-6 tracking-normal text-espresso"
                />
              </label>
              <div className="flex flex-wrap gap-4">
                {[
                  ["isActive", "Show item"],
                  ["showPrice", "Show price"],
                  ["isTypicallyAvailable", "Usually available"],
                  ["isFeatured", "Feature on home"]
                ].map(([key, label]) => (
                  <label key={key} className="inline-flex items-center gap-2 text-sm font-bold text-espresso/72">
                    <input
                      type="checkbox"
                      checked={Boolean(item[key as keyof BakeCatalogItem])}
                      onChange={(event) => updateItem(item.id, { [key]: event.target.checked })}
                      className="size-4 accent-rust"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
