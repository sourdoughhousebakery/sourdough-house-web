import {
  adminContentChangeEvent,
  adminContentStorageKey,
  createEditableTestimonial,
  deleteEditableTestimonial,
  hydrateAdminContent,
  updateEditableTestimonial,
  type EditableAdminContent,
  type EditableAnnouncement,
  type EditableContact,
  type EditableTestimonial,
  type PersistedAdminContent
} from "@/lib/admin-content/content";
import {
  createCatalogItem,
  deleteCatalogItem,
  getFeaturedCatalogItems,
  getPublicCatalogItems,
  hydrateCatalogItems,
  updateCatalogItem
} from "@/lib/catalog/catalog";
import type { BakeCatalogItem, PublicCatalogItem } from "@/lib/catalog/types";
import type { AdminDataSource, AssetRepository, CatalogRepository, CategoryRepository, CrudRepository, SingletonRepository } from "./types";

export const localCatalogStorageKey = "sourdough-house-bake-catalog";
export const localCategoryStorageKey = "sourdough-house-bake-categories";
export const localCatalogChangeEvent = "sourdough-house-catalog-change";

const starterCategories = ["Bread", "Sweets", "Breakfast", "Specials", "Custom", "Bakery"];

type LocalAdminDataSourceOptions = {
  defaultCatalogItems: BakeCatalogItem[];
  defaultContent: EditableAdminContent;
  storage?: Storage;
};

function getCatalogCategories(items: BakeCatalogItem[]) {
  return Array.from(new Set([...starterCategories, ...items.map((item) => item.category).filter(Boolean)])).sort((a, b) =>
    a.localeCompare(b)
  );
}

function emitBrowserEvent(name: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(name));
  }
}

class MemoryStorage implements Storage {
  private values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  clear() {
    this.values.clear();
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  key(index: number) {
    return Array.from(this.values.keys())[index] ?? null;
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

function getDefaultStorage() {
  return typeof window === "undefined" ? new MemoryStorage() : window.localStorage;
}

function readJson<T>(storage: Storage, key: string): T | null {
  const raw = storage.getItem(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    storage.removeItem(key);
    return null;
  }
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }
      reject(new Error("Unable to read uploaded image."));
    };
    reader.onerror = () => reject(reader.error ?? new Error("Unable to read uploaded image."));
    reader.readAsDataURL(file);
  });
}

export class LocalAdminDataSource implements AdminDataSource {
  readonly catalog: CatalogRepository;
  readonly categories: CategoryRepository;
  readonly announcement: SingletonRepository<EditableAnnouncement>;
  readonly contact: SingletonRepository<EditableContact>;
  readonly testimonials: CrudRepository<EditableTestimonial>;
  readonly assets: AssetRepository;

  private readonly defaultCatalogItems: BakeCatalogItem[];
  private readonly defaultContent: EditableAdminContent;
  private readonly storage: Storage;

  constructor({ defaultCatalogItems, defaultContent, storage }: LocalAdminDataSourceOptions) {
    this.defaultCatalogItems = defaultCatalogItems;
    this.defaultContent = defaultContent;
    this.storage = storage ?? getDefaultStorage();

    this.catalog = {
      list: async () => this.readCatalog(),
      listPublic: async () => getPublicCatalogItems(this.readCatalog()),
      listFeatured: async (limit = 3) => getFeaturedCatalogItems(this.readCatalog(), limit),
      get: async (id) => this.readCatalog().find((item) => item.id === id) ?? null,
      create: async (input = {}) => {
        const items = this.readCatalog();
        const nextItems = createCatalogItem(items);
        const created = nextItems.at(-1);
        if (!created) throw new Error("Unable to create catalog item.");
        const updatedCreated = { ...created, ...input, id: created.id };
        const updatedItems = updateCatalogItem(nextItems, created.id, updatedCreated);
        this.writeCatalog(updatedItems);
        return updatedCreated;
      },
      update: async (id, patch) => {
        const items = this.readCatalog();
        const updatedItems = updateCatalogItem(items, id, patch);
        const updated = updatedItems.find((item) => item.id === id);
        if (!updated) throw new Error(`Catalog item ${id} was not found.`);
        this.writeCatalog(updatedItems);
        return updated;
      },
      delete: async (id) => {
        this.writeCatalog(deleteCatalogItem(this.readCatalog(), id));
      }
    };

    this.categories = {
      list: async () => this.readCategories(),
      create: async (name) => {
        const category = name.trim();
        if (!category) return this.readCategories();
        const nextCategories = Array.from(new Set([...this.readCategories(), category])).sort((a, b) => a.localeCompare(b));
        this.writeCategories(nextCategories);
        return nextCategories;
      },
      delete: async (name) => {
        const category = name.trim();
        const isInUse = this.readCatalog().some((item) => item.category === category);
        if (!category || isInUse) return this.readCategories();
        const nextCategories = this.readCategories().filter((item) => item !== category);
        this.writeCategories(nextCategories);
        return nextCategories;
      }
    };

    this.announcement = {
      get: async () => this.readContent().announcement,
      update: async (patch) => {
        const content = this.readContent();
        const nextContent = {
          ...content,
          announcement: { ...content.announcement, ...patch }
        };
        this.writeContent(nextContent);
        return nextContent.announcement;
      }
    };

    this.contact = {
      get: async () => this.readContent().contact,
      update: async (patch) => {
        const content = this.readContent();
        const nextContent = {
          ...content,
          contact: { ...content.contact, ...patch }
        };
        this.writeContent(nextContent);
        return nextContent.contact;
      }
    };

    this.testimonials = {
      list: async () => this.readContent().testimonials,
      get: async (id) => this.readContent().testimonials.find((testimonial) => testimonial.id === id) ?? null,
      create: async (input = {}) => {
        const content = this.readContent();
        const testimonials = createEditableTestimonial(content.testimonials);
        const created = testimonials.at(-1);
        if (!created) throw new Error("Unable to create testimonial.");
        const updatedCreated = { ...created, ...input, id: created.id };
        const nextContent = {
          ...content,
          testimonials: updateEditableTestimonial(testimonials, created.id, updatedCreated)
        };
        this.writeContent(nextContent);
        return updatedCreated;
      },
      update: async (id, patch) => {
        const content = this.readContent();
        const testimonials = updateEditableTestimonial(content.testimonials, id, patch);
        const updated = testimonials.find((testimonial) => testimonial.id === id);
        if (!updated) throw new Error(`Testimonial ${id} was not found.`);
        this.writeContent({ ...content, testimonials });
        return updated;
      },
      delete: async (id) => {
        const content = this.readContent();
        this.writeContent({
          ...content,
          testimonials: deleteEditableTestimonial(content.testimonials, id)
        });
      }
    };

    this.assets = {
      link: async (url) => ({ url }),
      upload: async (file) => ({ url: await fileToDataUrl(file) })
    };
  }

  private readCatalog() {
    const persistedItems = readJson<PublicCatalogItem[]>(this.storage, localCatalogStorageKey);
    return Array.isArray(persistedItems) ? hydrateCatalogItems(this.defaultCatalogItems, persistedItems) : this.defaultCatalogItems;
  }

  private writeCatalog(items: BakeCatalogItem[]) {
    this.storage.setItem(localCatalogStorageKey, JSON.stringify(items));
    emitBrowserEvent(localCatalogChangeEvent);
  }

  private readCategories() {
    const persistedCategories = readJson<string[]>(this.storage, localCategoryStorageKey);
    if (!Array.isArray(persistedCategories)) return getCatalogCategories(this.readCatalog());
    return Array.from(new Set(persistedCategories.filter((value) => typeof value === "string" && value.trim().length > 0))).sort((a, b) =>
      a.localeCompare(b)
    );
  }

  private writeCategories(categories: string[]) {
    this.storage.setItem(localCategoryStorageKey, JSON.stringify(categories));
  }

  private readContent() {
    const persistedContent = readJson<PersistedAdminContent>(this.storage, adminContentStorageKey);
    return persistedContent ? hydrateAdminContent(this.defaultContent, persistedContent) : this.defaultContent;
  }

  private writeContent(content: EditableAdminContent) {
    this.storage.setItem(adminContentStorageKey, JSON.stringify(content));
    emitBrowserEvent(adminContentChangeEvent);
  }
}
