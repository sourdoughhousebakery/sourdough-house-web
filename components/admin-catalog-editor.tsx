"use client";

import { Eye, Plus, RotateCcw, Save, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import type { BakeCatalogItem, PublicCatalogItem } from "@/lib/catalog/types";
import {
  createCatalogItem,
  deleteCatalogItem,
  getPublicCatalogItems,
  hydrateCatalogItems,
  updateCatalogItem
} from "@/lib/catalog/catalog";

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
      return hydrateCatalogItems(defaultItems, publicItems);
    } catch {
      window.localStorage.removeItem(storageKey);
      return defaultItems;
    }
  });
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<BakeCatalogItem | null>(null);

  const publicItems = useMemo(() => toPublicItems(items), [items]);

  function updateItem(id: string, patch: Partial<BakeCatalogItem>) {
    setItems((current) => updateCatalogItem(current, id, patch));
  }

  function addItem() {
    setItems((current) => createCatalogItem(current));
    setSavedAt(null);
  }

  function removeItem(id: string) {
    setItems((current) => deleteCatalogItem(current, id));
    setSavedAt(null);
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
            onClick={addItem}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-gold px-5 text-sm font-black text-espresso"
          >
            <Plus aria-hidden size={17} />
            Add item
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
            <div className="flex flex-col gap-3 self-start">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1rem] bg-gold/10">
                <Image src={item.image} alt="" fill sizes="180px" className="object-cover" />
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(item)}
                className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-espresso/15 bg-white px-4 text-sm font-black text-espresso"
              >
                <Eye aria-hidden size={16} />
                Preview image
              </button>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-3 md:grid-cols-2">
                <label htmlFor={`${item.id}-name`} className="grid gap-1 text-xs font-black uppercase tracking-[0.12em] text-rust">
                  Name
                  <input
                    id={`${item.id}-name`}
                    aria-label="Name"
                    value={item.name}
                    onChange={(event) => updateItem(item.id, { name: event.target.value })}
                    className="rounded-xl border border-espresso/12 px-3 py-2 text-sm font-semibold normal-case tracking-normal text-espresso"
                  />
                </label>
                <label htmlFor={`${item.id}-category`} className="grid gap-1 text-xs font-black uppercase tracking-[0.12em] text-rust">
                  Category
                  <input
                    id={`${item.id}-category`}
                    aria-label="Category"
                    value={item.category}
                    onChange={(event) => updateItem(item.id, { category: event.target.value })}
                    className="rounded-xl border border-espresso/12 px-3 py-2 text-sm font-semibold normal-case tracking-normal text-espresso"
                  />
                </label>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <label htmlFor={`${item.id}-price`} className="grid gap-1 text-xs font-black uppercase tracking-[0.12em] text-rust">
                  Price
                  <input
                    id={`${item.id}-price`}
                    aria-label="Price"
                    value={item.price}
                    onChange={(event) => updateItem(item.id, { price: event.target.value })}
                    className="rounded-xl border border-espresso/12 px-3 py-2 text-sm font-semibold normal-case tracking-normal text-espresso"
                  />
                </label>
                <label htmlFor={`${item.id}-note`} className="grid gap-1 text-xs font-black uppercase tracking-[0.12em] text-rust">
                  Note
                  <input
                    id={`${item.id}-note`}
                    aria-label="Note"
                    value={item.note ?? ""}
                    onChange={(event) => updateItem(item.id, { note: event.target.value })}
                    className="rounded-xl border border-espresso/12 px-3 py-2 text-sm font-semibold normal-case tracking-normal text-espresso"
                  />
                </label>
              </div>
              <label htmlFor={`${item.id}-image`} className="grid gap-1 text-xs font-black uppercase tracking-[0.12em] text-rust">
                Image URL
                <input
                  id={`${item.id}-image`}
                  aria-label="Image URL"
                  value={item.image}
                  onChange={(event) => updateItem(item.id, { image: event.target.value })}
                  className="rounded-xl border border-espresso/12 px-3 py-2 text-sm font-semibold normal-case tracking-normal text-espresso"
                />
              </label>
              <label htmlFor={`${item.id}-description`} className="grid gap-1 text-xs font-black uppercase tracking-[0.12em] text-rust">
                Description
                <textarea
                  id={`${item.id}-description`}
                  aria-label="Description"
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
              <div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="inline-flex min-h-10 items-center gap-2 rounded-full border border-rust/20 bg-rust/8 px-4 text-sm font-black text-rust"
                >
                  <Trash2 aria-hidden size={16} />
                  Delete item
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {previewItem ? (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-espresso/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="image-preview-title"
          onClick={() => setPreviewItem(null)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setPreviewItem(null);
          }}
        >
          <div
            className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[2rem] bg-cream shadow-lift"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 border-b border-espresso/10 p-4 md:p-5">
              <div>
                <h2 id="image-preview-title" className="font-serif text-2xl text-espresso md:text-3xl">
                  {previewItem.name}
                </h2>
                <p className="mt-1 break-all text-xs font-semibold text-espresso/55">{previewItem.image}</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-espresso shadow-soft"
                aria-label="Close image preview"
              >
                <X aria-hidden size={20} />
              </button>
            </div>
            <div className="relative h-[72vh] bg-espresso/8">
              <Image
                src={previewItem.image}
                alt={`${previewItem.name} full preview`}
                fill
                sizes="min(100vw, 1024px)"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
