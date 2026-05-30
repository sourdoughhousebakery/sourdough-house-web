import { promises as fs } from "node:fs";
import path from "node:path";
import {
  createEditableTestimonial,
  deleteEditableTestimonial,
  type EditableAdminContent,
  type EditableAnnouncement,
  type EditableContact,
  type EditableHero,
  type EditableTestimonial,
  getDefaultAdminContent,
  hydrateAdminContent,
  updateEditableTestimonial
} from "@/lib/admin-content/content";
import {
  createCatalogItem,
  deleteCatalogItem,
  getFeaturedCatalogItems,
  getPublicCatalogItems,
  updateCatalogItem
} from "@/lib/catalog/catalog";
import type { BakeCatalogItem } from "@/lib/catalog/types";
import type { AdminDataSource, AssetRepository, CatalogRepository, CategoryRepository, CrudRepository, SingletonRepository } from "./types";

const dataDir = path.join(process.cwd(), "data");
const catalogPath = path.join(dataDir, "catalog-items.json");
const categoriesPath = path.join(dataDir, "catalog-categories.json");
const contentPath = path.join(dataDir, "admin-content.json");

async function readJson<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

async function writeJson(filePath: string, data: unknown) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export class DiskAdminDataSource implements AdminDataSource {
  readonly catalog: CatalogRepository;
  readonly categories: CategoryRepository;
  readonly hero: SingletonRepository<EditableHero>;
  readonly announcement: SingletonRepository<EditableAnnouncement>;
  readonly contact: SingletonRepository<EditableContact>;
  readonly testimonials: CrudRepository<EditableTestimonial>;
  readonly assets: AssetRepository;

  constructor() {
    this.catalog = {
      list: () => this.readCatalog(),
      listPublic: async () => getPublicCatalogItems(await this.readCatalog()),
      listFeatured: async (limit = 3) => getFeaturedCatalogItems(await this.readCatalog(), limit),
      get: async (id) => (await this.readCatalog()).find((item) => item.id === id) ?? null,
      create: async (input = {}) => {
        const items = await this.readCatalog();
        const nextItems = createCatalogItem(items);
        const created = nextItems.at(-1);
        if (!created) throw new Error("Unable to create catalog item.");
        const updatedCreated = { ...created, ...input, id: created.id };
        const updatedItems = updateCatalogItem(nextItems, created.id, updatedCreated);
        await this.writeCatalog(updatedItems);
        return updatedCreated;
      },
      update: async (id, patch) => {
        const items = await this.readCatalog();
        const updatedItems = updateCatalogItem(items, id, patch);
        const updated = updatedItems.find((item) => item.id === id);
        if (!updated) throw new Error(`Catalog item ${id} was not found.`);
        await this.writeCatalog(updatedItems);
        return updated;
      },
      delete: async (id) => {
        await this.writeCatalog(deleteCatalogItem(await this.readCatalog(), id));
      }
    };

    this.categories = {
      list: () => readJson<string[]>(categoriesPath),
      create: async (name) => {
        const category = name.trim();
        const categories = await readJson<string[]>(categoriesPath);
        if (!category) return categories;
        const nextCategories = Array.from(new Set([...categories, category])).sort((a, b) => a.localeCompare(b));
        await writeJson(categoriesPath, nextCategories);
        return nextCategories;
      },
      delete: async (name) => {
        const category = name.trim();
        const categories = await readJson<string[]>(categoriesPath);
        const isInUse = (await this.readCatalog()).some((item) => item.category === category);
        if (!category || isInUse) return categories;
        const nextCategories = categories.filter((item) => item !== category);
        await writeJson(categoriesPath, nextCategories);
        return nextCategories;
      }
    };

    this.hero = {
      get: async () => (await this.readContent()).hero,
      update: async (patch) => {
        const content = await this.readContent();
        const nextContent = {
          ...content,
          hero: { ...content.hero, ...patch }
        };
        await this.writeContent(nextContent);
        return nextContent.hero;
      }
    };

    this.announcement = {
      get: async () => (await this.readContent()).announcement,
      update: async (patch) => {
        const content = await this.readContent();
        const nextContent = {
          ...content,
          announcement: { ...content.announcement, ...patch }
        };
        await this.writeContent(nextContent);
        return nextContent.announcement;
      }
    };

    this.contact = {
      get: async () => (await this.readContent()).contact,
      update: async (patch) => {
        const content = await this.readContent();
        const nextContent = {
          ...content,
          contact: { ...content.contact, ...patch }
        };
        await this.writeContent(nextContent);
        return nextContent.contact;
      }
    };

    this.testimonials = {
      list: async () => (await this.readContent()).testimonials,
      get: async (id) => (await this.readContent()).testimonials.find((testimonial) => testimonial.id === id) ?? null,
      create: async (input = {}) => {
        const content = await this.readContent();
        const testimonials = createEditableTestimonial(content.testimonials);
        const created = testimonials.at(-1);
        if (!created) throw new Error("Unable to create testimonial.");
        const updatedCreated = { ...created, ...input, id: created.id };
        const nextContent = {
          ...content,
          testimonials: updateEditableTestimonial(testimonials, created.id, updatedCreated)
        };
        await this.writeContent(nextContent);
        return updatedCreated;
      },
      update: async (id, patch) => {
        const content = await this.readContent();
        const testimonials = updateEditableTestimonial(content.testimonials, id, patch);
        const updated = testimonials.find((testimonial) => testimonial.id === id);
        if (!updated) throw new Error(`Testimonial ${id} was not found.`);
        await this.writeContent({ ...content, testimonials });
        return updated;
      },
      delete: async (id) => {
        const content = await this.readContent();
        await this.writeContent({
          ...content,
          testimonials: deleteEditableTestimonial(content.testimonials, id)
        });
      }
    };

    this.assets = {
      link: async (url) => ({ url }),
      upload: async (file) => ({ url: await file.text() })
    };
  }

  private readCatalog() {
    return readJson<BakeCatalogItem[]>(catalogPath);
  }

  private writeCatalog(items: BakeCatalogItem[]) {
    return writeJson(catalogPath, items);
  }

  private readContent() {
    return readJson<Partial<EditableAdminContent>>(contentPath).then((content) => hydrateAdminContent(getDefaultAdminContent(), content));
  }

  private writeContent(content: EditableAdminContent) {
    return writeJson(contentPath, content);
  }
}

export const diskAdminDataSource = new DiskAdminDataSource();
