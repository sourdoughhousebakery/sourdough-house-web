"use client";

import { Check, Eye, Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { AdminToastInput } from "@/components/admin-toast";
import type { AdminDataSource } from "@/lib/admin-data/types";
import type { BakeCatalogItem } from "@/lib/catalog/types";
import { isDataImageSrc } from "@/lib/images";
import { updateCatalogItem } from "@/lib/catalog/catalog";

type AdminCatalogEditorProps = {
  dataSource: AdminDataSource;
  defaultItems: BakeCatalogItem[];
  title?: string;
  description?: string;
  onNotify?: (toast: AdminToastInput) => void;
};

export function AdminCatalogEditor({
  dataSource,
  defaultItems,
  title = "Menu and catalog",
  description = "Add, update, feature, or hide the regular bakery items shown in the menu preview.",
  onNotify
}: AdminCatalogEditorProps) {
  const [items, setItems] = useState<BakeCatalogItem[]>(defaultItems);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(() => defaultItems[0]?.id ?? null);
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState("");
  const [status, setStatus] = useState("Ready");
  const [previewItem, setPreviewItem] = useState<BakeCatalogItem | null>(null);

  const selectedItem = items.find((item) => item.id === selectedItemId) ?? items[0] ?? null;

  useEffect(() => {
    let isCurrent = true;

    async function loadCatalog() {
      const [loadedItems, loadedCategories] = await Promise.all([dataSource.catalog.list(), dataSource.categories.list()]);
      if (!isCurrent) return;
      setItems(loadedItems);
      setCategories(loadedCategories);
      setSelectedItemId((current) => current ?? loadedItems[0]?.id ?? null);
    }

    loadCatalog().catch(() => {
      if (isCurrent) {
        setStatus("Could not load catalog");
        onNotify?.({ tone: "error", title: "Catalog could not load" });
      }
    });

    return () => {
      isCurrent = false;
    };
  }, [dataSource, onNotify]);

  function changeItem(id: string, patch: Partial<BakeCatalogItem>) {
    setItems((current) => updateCatalogItem(current, id, patch));
    setStatus("Unsaved changes");
  }

  async function saveItem(item: BakeCatalogItem) {
    setStatus("Saving...");
    try {
      const updated = await dataSource.catalog.update(item.id, item);
      setItems((current) => updateCatalogItem(current, item.id, updated));
      setStatus("Saved");
      onNotify?.({ tone: "success", title: "Item saved", message: `${updated.name} is updated.` });
    } catch (error) {
      setStatus("Could not save item");
      onNotify?.({ tone: "error", title: "Item was not saved", message: getErrorMessage(error) });
    }
  }

  async function addItem() {
    setStatus("Saving...");
    try {
      const created = await dataSource.catalog.create(categories[0] ? { category: categories[0] } : undefined);
      setItems((current) => [...current, created]);
      setSelectedItemId(created.id);
      setStatus("Saved");
      onNotify?.({ tone: "success", title: "Item added", message: `${created.name} is ready to edit.` });
    } catch (error) {
      setStatus("Could not add item");
      onNotify?.({ tone: "error", title: "Item was not added", message: getErrorMessage(error) });
    }
  }

  async function addCategory() {
    const category = newCategory.trim();
    if (!category || categories.includes(category)) return;
    setStatus("Saving...");
    try {
      const nextCategories = await dataSource.categories.create(category);
      setCategories(nextCategories);
      setCategoryToDelete(category);
      setNewCategory("");
      setStatus("Saved");
      onNotify?.({ tone: "success", title: "Category added", message: `${category} is available in the category menu.` });
    } catch (error) {
      setStatus("Could not add category");
      onNotify?.({ tone: "error", title: "Category was not added", message: getErrorMessage(error) });
    }
  }

  async function deleteCategory() {
    if (!categoryToDelete) return;
    const isInUse = items.some((item) => item.category === categoryToDelete);
    if (isInUse) {
      onNotify?.({ tone: "error", title: "Category is still in use", message: "Move items out of this category before deleting it." });
      return;
    }
    const deletedCategory = categoryToDelete;
    setStatus("Saving...");
    try {
      const nextCategories = await dataSource.categories.delete(deletedCategory);
      setCategories(nextCategories);
      setCategoryToDelete("");
      setStatus("Saved");
      onNotify?.({ tone: "success", title: "Category deleted", message: `${deletedCategory} was removed.` });
    } catch (error) {
      setStatus("Could not delete category");
      onNotify?.({ tone: "error", title: "Category was not deleted", message: getErrorMessage(error) });
    }
  }

  async function removeItem(id: string) {
    const itemName = items.find((item) => item.id === id)?.name ?? "Item";
    setStatus("Saving...");
    try {
      await dataSource.catalog.delete(id);
      setItems((current) => {
        const nextItems = current.filter((item) => item.id !== id);
        if (selectedItemId === id) setSelectedItemId(nextItems[0]?.id ?? null);
        return nextItems;
      });
      setStatus("Saved");
      onNotify?.({ tone: "success", title: "Item deleted", message: `${itemName} was removed from the catalog.` });
    } catch (error) {
      setStatus("Could not delete item");
      onNotify?.({ tone: "error", title: "Item was not deleted", message: getErrorMessage(error) });
    }
  }

  async function uploadImage(file: File, itemId: string) {
    setStatus("Saving image...");
    try {
      const asset = await dataSource.assets.upload(file);
      changeItem(itemId, { image: asset.url });
      setStatus("Image ready. Save item to publish.");
      onNotify?.({ tone: "success", title: "Image uploaded", message: "Save the item to publish the new image." });
    } catch (error) {
      setStatus("Could not upload image");
      onNotify?.({ tone: "error", title: "Image was not uploaded", message: getErrorMessage(error) });
    }
  }

  return (
    <div className="grid gap-8">
      <div className="rounded-[2rem] border border-rust/15 bg-white p-5 shadow-soft">
        <h2 className="font-serif text-3xl text-espresso">{title}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-espresso/68">{description}</p>
        <p className="mt-3 text-sm font-bold text-espresso/60">Edit fields locally, then use Save item to publish changes through the admin data API.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={addItem}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-gold px-5 text-sm font-black text-espresso"
          >
            <Plus aria-hidden size={17} />
            Add item
          </button>
          <p className="self-center text-sm font-bold text-sage">{status}</p>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-5">
          <div className="rounded-[1.5rem] border border-espresso/10 bg-white p-4 shadow-soft">
            <h3 className="font-serif text-2xl text-espresso">Categories</h3>
            <p className="mt-1 text-sm font-semibold text-espresso/60">
              Categories keep the menu organized. Delete is available only for categories no item is using.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
              <input
                value={newCategory}
                onChange={(event) => setNewCategory(event.target.value)}
                placeholder="Add a category"
                className="rounded-xl border border-espresso/12 px-3 py-2 text-sm font-semibold text-espresso"
              />
              <button
                type="button"
                onClick={addCategory}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-gold px-4 text-sm font-black text-espresso"
              >
                <Plus aria-hidden size={16} />
                Add category
              </button>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto]">
              <select
                value={categoryToDelete}
                onChange={(event) => setCategoryToDelete(event.target.value)}
                className="rounded-xl border border-espresso/12 px-3 py-2 text-sm font-semibold text-espresso"
              >
                <option value="">Choose unused category to delete</option>
                {categories.map((category) => {
                  const inUse = items.some((item) => item.category === category);

                  return (
                    <option key={category} value={category} disabled={inUse}>
                      {category}
                      {inUse ? " (in use)" : ""}
                    </option>
                  );
                })}
              </select>
              <button
                type="button"
                onClick={deleteCategory}
                disabled={!categoryToDelete || items.some((item) => item.category === categoryToDelete)}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-rust/20 bg-rust/8 px-4 text-sm font-black text-rust disabled:cursor-not-allowed disabled:opacity-45"
              >
                <Trash2 aria-hidden size={16} />
                Delete category
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.5rem] border border-espresso/10 bg-white shadow-soft">
            <div className="border-b border-espresso/10 p-4">
              <h3 className="font-serif text-2xl text-espresso">All items</h3>
              <p className="mt-1 text-sm font-semibold text-espresso/60">Pick one item to edit. The selected row opens in the form.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead className="bg-cream/70 text-xs font-black uppercase tracking-[0.12em] text-rust">
                  <tr>
                    <th className="px-4 py-3">Item</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Homepage</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-espresso/8 text-sm">
                  {items.map((item) => (
                    <tr key={item.id} className={selectedItem?.id === item.id ? "bg-gold/12" : "bg-white"}>
                      <td className="px-4 py-3">
                        <div className="font-black text-espresso">{item.name}</div>
                        <div className="mt-1 max-w-xs truncate text-xs font-semibold text-espresso/55">{item.note || item.description}</div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-espresso/70">{item.category}</td>
                      <td className="px-4 py-3 font-hand text-xl font-bold text-rust">{item.showPrice ? item.price || "No price" : "Hidden"}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-black ${item.isActive ? "bg-sage/12 text-sage" : "bg-rust/10 text-rust"}`}>
                          {item.isActive ? "Visible" : "Hidden"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-espresso/70">{item.isFeatured ? "Featured" : "No"}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedItemId(item.id)}
                            className="inline-flex size-10 items-center justify-center rounded-full border border-espresso/15 bg-white text-espresso hover:border-rust/30 hover:text-rust"
                            aria-label={`Edit ${item.name}`}
                            title={`Edit ${item.name}`}
                          >
                            <Pencil aria-hidden size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="inline-flex size-10 items-center justify-center rounded-full border border-rust/20 bg-rust/8 text-rust hover:bg-rust/12"
                            aria-label={`Delete ${item.name}`}
                            title={`Delete ${item.name}`}
                          >
                            <Trash2 aria-hidden size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {selectedItem ? (
          <article className="grid gap-5 rounded-[1.5rem] border border-espresso/10 bg-white p-4 shadow-soft">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.12em] text-rust">Editing</p>
              <h3 className="mt-1 font-serif text-3xl text-espresso">{selectedItem.name}</h3>
            </div>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1rem] bg-gold/10">
              <Image
                src={selectedItem.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                unoptimized={isDataImageSrc(selectedItem.image)}
                className="object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => setPreviewItem(selectedItem)}
              className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-espresso/15 bg-white px-4 text-sm font-black text-espresso"
            >
              <Eye aria-hidden size={16} />
              Preview image
            </button>

            <TextInput label="Name" value={selectedItem.name} onChange={(value) => changeItem(selectedItem.id, { name: value })} />
            <label className="grid gap-1 text-xs font-black uppercase tracking-[0.12em] text-rust">
              Category
              <select
                value={selectedItem.category}
                onChange={(event) => changeItem(selectedItem.id, { category: event.target.value })}
                className="rounded-xl border border-espresso/12 px-3 py-2 text-sm font-semibold normal-case tracking-normal text-espresso"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <TextInput label="Price" value={selectedItem.price} onChange={(value) => changeItem(selectedItem.id, { price: value })} />
              <TextInput label="Note" value={selectedItem.note ?? ""} onChange={(value) => changeItem(selectedItem.id, { note: value })} />
            </div>
            <div className="flex flex-wrap gap-3">
              <TextInput label="Image URL" value={selectedItem.image} onChange={(value) => changeItem(selectedItem.id, { image: value })} />
              <label className="grid gap-2 text-xs font-black uppercase tracking-[0.12em] text-rust">
                Upload image
                <span className="text-sm font-semibold normal-case leading-6 tracking-normal text-espresso/60">
                  Use a hosted image URL above, or upload a local image for this browser preview.
                </span>
                <span className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-espresso/15 bg-white px-4 text-sm font-black normal-case tracking-normal text-espresso hover:border-rust/30 hover:text-rust">
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
                      uploadImage(file, selectedItem.id);
                    }}
                  />
                </span>
              </label>
            </div>
            <TextArea label="Description" value={selectedItem.description} onChange={(value) => changeItem(selectedItem.id, { description: value })} />

            <div className="grid gap-3">
              {[
                ["isActive", "Show item"],
                ["showPrice", "Show price"],
                ["isTypicallyAvailable", "Usually available"],
                ["isFeatured", "Feature on home"]
              ].map(([key, label]) => (
                <ToggleButton
                  key={key}
                  label={label}
                  pressed={Boolean(selectedItem[key as keyof BakeCatalogItem])}
                  onChange={(pressed) => changeItem(selectedItem.id, { [key]: pressed })}
                />
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => saveItem(selectedItem)}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-6 text-sm font-black text-espresso shadow-soft transition active:translate-y-px"
              >
                Save item
              </button>
              <button
                type="button"
                onClick={() => removeItem(selectedItem.id)}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-rust/20 bg-rust/8 px-5 text-sm font-black text-rust transition hover:bg-rust/12 active:translate-y-px"
              >
                <Trash2 aria-hidden size={16} />
                Delete item
              </button>
            </div>
          </article>
        ) : (
          <div className="rounded-[1.5rem] border border-espresso/10 bg-white p-5 text-sm font-semibold text-espresso/60 shadow-soft">
            Add an item or select one from the table to edit it.
          </div>
        )}
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
                unoptimized={isDataImageSrc(previewItem.image)}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Try again or refresh the page.";
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
