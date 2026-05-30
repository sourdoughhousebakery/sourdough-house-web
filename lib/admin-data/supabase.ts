import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  createEditableTestimonial,
  getDefaultAdminContent,
  type EditableAdminContent,
  type EditableAnnouncement,
  type EditableContact,
  type EditableHero,
  type EditableTestimonial
} from "@/lib/admin-content/content";
import {
  createCatalogItem,
  getFeaturedCatalogItems,
  getPublicCatalogItems,
} from "@/lib/catalog/catalog";
import type { BakeCatalogItem } from "@/lib/catalog/types";
import type { AdminDataSource, AssetRepository, CatalogRepository, CategoryRepository, CrudRepository, SingletonRepository } from "./types";

type CatalogRow = {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  price: string;
  note: string | null;
  is_active: boolean;
  is_featured: boolean;
  is_typically_available: boolean;
  show_price: boolean;
  sort_order?: number | null;
};

type TestimonialRow = {
  id: string;
  quote: string;
  name: string;
  source: string;
  is_active: boolean;
  sort_order?: number | null;
};

type SiteContentKey = "hero" | "announcement" | "contact";

const siteAssetBucket = "site-assets";

function assertOk<T>(result: { data: T; error: { message: string } | null }) {
  if (result.error) throw new Error(result.error.message);
  return result.data;
}

function assertRow<T>(row: T | null, message: string): T {
  if (!row) throw new Error(message);
  return row;
}

function parseDataUrl(value: string) {
  const match = /^data:([^;,]+)?(;base64)?,([\s\S]*)$/.exec(value);
  if (!match) return null;

  const contentType = match[1] || "application/octet-stream";
  const isBase64 = Boolean(match[2]);
  const body = match[3] ?? "";
  const bytes = isBase64 ? Buffer.from(body, "base64") : Buffer.from(decodeURIComponent(body));

  return { bytes, contentType };
}

function extensionForContentType(contentType: string) {
  if (contentType === "image/jpeg") return "jpg";
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  if (contentType === "image/gif") return "gif";
  return "bin";
}

export function catalogItemFromRow(row: CatalogRow): BakeCatalogItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    image: row.image,
    price: row.price,
    note: row.note ?? undefined,
    isActive: row.is_active,
    isFeatured: row.is_featured,
    isTypicallyAvailable: row.is_typically_available,
    showPrice: row.show_price
  };
}

export function catalogItemToRow(item: Partial<BakeCatalogItem>): Partial<CatalogRow> {
  return {
    ...(item.id !== undefined ? { id: item.id } : {}),
    ...(item.name !== undefined ? { name: item.name } : {}),
    ...(item.description !== undefined ? { description: item.description } : {}),
    ...(item.category !== undefined ? { category: item.category } : {}),
    ...(item.image !== undefined ? { image: item.image } : {}),
    ...(item.price !== undefined ? { price: item.price } : {}),
    ...(item.note !== undefined ? { note: item.note } : {}),
    ...(item.isActive !== undefined ? { is_active: item.isActive } : {}),
    ...(item.isFeatured !== undefined ? { is_featured: item.isFeatured } : {}),
    ...(item.isTypicallyAvailable !== undefined ? { is_typically_available: item.isTypicallyAvailable } : {}),
    ...(item.showPrice !== undefined ? { show_price: item.showPrice } : {})
  };
}

export function testimonialFromRow(row: TestimonialRow): EditableTestimonial {
  return {
    id: row.id,
    quote: row.quote,
    name: row.name,
    source: row.source,
    isActive: row.is_active
  };
}

export function testimonialToRow(testimonial: Partial<EditableTestimonial>): Partial<TestimonialRow> {
  return {
    ...(testimonial.id !== undefined ? { id: testimonial.id } : {}),
    ...(testimonial.quote !== undefined ? { quote: testimonial.quote } : {}),
    ...(testimonial.name !== undefined ? { name: testimonial.name } : {}),
    ...(testimonial.source !== undefined ? { source: testimonial.source } : {}),
    ...(testimonial.isActive !== undefined ? { is_active: testimonial.isActive } : {})
  };
}

function createServerSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    throw new Error("Supabase admin source requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY.");
  }

  return createClient(url, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

export class SupabaseAdminDataSource implements AdminDataSource {
  readonly catalog: CatalogRepository;
  readonly categories: CategoryRepository;
  readonly hero: SingletonRepository<EditableHero>;
  readonly announcement: SingletonRepository<EditableAnnouncement>;
  readonly contact: SingletonRepository<EditableContact>;
  readonly testimonials: CrudRepository<EditableTestimonial>;
  readonly assets: AssetRepository;

  constructor(private readonly client: SupabaseClient = createServerSupabaseClient()) {
    this.catalog = {
      list: async () => this.listCatalog(),
      listPublic: async () => getPublicCatalogItems(await this.listCatalog()),
      listFeatured: async (limit = 3) => getFeaturedCatalogItems(await this.listCatalog(), limit),
      get: async (id) => {
        const row = assertOk(
          await this.client.from("catalog_items").select("*").eq("id", id).maybeSingle<CatalogRow>()
        );
        return row ? catalogItemFromRow(row) : null;
      },
      create: async (input = {}) => {
        const created = createCatalogItem([], `catalog-${Date.now().toString(36)}`).at(0);
        if (!created) throw new Error("Unable to create catalog item.");
        const item = { ...created, ...input, id: created.id };
        const row = assertOk(
          await this.client.from("catalog_items").insert(catalogItemToRow(item)).select("*").single<CatalogRow>()
        );
        return catalogItemFromRow(assertRow(row, "Unable to create catalog item."));
      },
      update: async (id, patch) => {
        const row = assertOk(
          await this.client.from("catalog_items").update(catalogItemToRow(patch)).eq("id", id).select("*").single<CatalogRow>()
        );
        return catalogItemFromRow(assertRow(row, `Catalog item ${id} was not found.`));
      },
      delete: async (id) => {
        assertOk(await this.client.from("catalog_items").delete().eq("id", id));
      }
    };

    this.categories = {
      list: async () => {
        const rows = assertOk(
          await this.client.from("catalog_categories").select("name").order("sort_order", { ascending: true }).order("name", { ascending: true })
        ) as Array<{ name: string }>;
        return rows.map((row) => row.name);
      },
      create: async (name) => {
        const category = name.trim();
        if (!category) return this.categories.list();
        assertOk(await this.client.from("catalog_categories").upsert({ name: category }));
        return this.categories.list();
      },
      delete: async (name) => {
        const category = name.trim();
        if (!category) return this.categories.list();
        const inUse = assertOk(
          await this.client.from("catalog_items").select("id").eq("category", category).limit(1)
        ) as Array<{ id: string }>;
        if (inUse.length > 0) return this.categories.list();
        assertOk(await this.client.from("catalog_categories").delete().eq("name", category));
        return this.categories.list();
      }
    };

    this.hero = this.singletonContent<EditableHero>("hero");
    this.announcement = this.singletonContent<EditableAnnouncement>("announcement");
    this.contact = this.singletonContent<EditableContact>("contact");

    this.testimonials = {
      list: async () => this.listTestimonials(),
      get: async (id) => {
        const row = assertOk(
          await this.client.from("testimonials").select("*").eq("id", id).maybeSingle<TestimonialRow>()
        );
        return row ? testimonialFromRow(row) : null;
      },
      create: async (input = {}) => {
        const created = createEditableTestimonial([]).at(0);
        if (!created) throw new Error("Unable to create testimonial.");
        const testimonial = { ...created, ...input, id: created.id };
        const row = assertOk(
          await this.client.from("testimonials").insert(testimonialToRow(testimonial)).select("*").single<TestimonialRow>()
        );
        return testimonialFromRow(assertRow(row, "Unable to create testimonial."));
      },
      update: async (id, patch) => {
        const row = assertOk(
          await this.client.from("testimonials").update(testimonialToRow(patch)).eq("id", id).select("*").single<TestimonialRow>()
        );
        return testimonialFromRow(assertRow(row, `Testimonial ${id} was not found.`));
      },
      delete: async (id) => {
        assertOk(await this.client.from("testimonials").delete().eq("id", id));
      }
    };

    this.assets = {
      link: async (url) => {
        const dataUrl = parseDataUrl(url);
        if (!dataUrl) return { url };
        return this.uploadAsset(dataUrl.bytes, dataUrl.contentType, extensionForContentType(dataUrl.contentType));
      },
      upload: async (file) => {
        const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
        return this.uploadAsset(await file.arrayBuffer(), file.type || "application/octet-stream", extension);
      }
    };
  }

  private async uploadAsset(data: ArrayBuffer | Buffer, contentType: string, extension: string) {
    const path = `uploads/${Date.now().toString(36)}-${crypto.randomUUID()}.${extension}`;
    assertOk(
      await this.client.storage.from(siteAssetBucket).upload(path, data, {
        contentType,
        upsert: false
      })
    );
    const { data: publicUrl } = this.client.storage.from(siteAssetBucket).getPublicUrl(path);
    return { url: publicUrl.publicUrl };
  }

  private async listCatalog() {
    const rows = assertOk(
      await this.client.from("catalog_items").select("*").order("sort_order", { ascending: true }).order("name", { ascending: true })
    ) as CatalogRow[];
    return rows.map(catalogItemFromRow);
  }

  private async listTestimonials() {
    const rows = assertOk(
      await this.client.from("testimonials").select("*").order("sort_order", { ascending: true }).order("name", { ascending: true })
    ) as TestimonialRow[];
    return rows.map(testimonialFromRow);
  }

  private singletonContent<T extends EditableAdminContent[SiteContentKey]>(key: SiteContentKey): SingletonRepository<T> {
    return {
      get: async () => {
        const row = assertOk(
          await this.client.from("site_content").select("value").eq("key", key).maybeSingle<{ value: Partial<T> }>()
        );
        return {
          ...getDefaultAdminContent()[key],
          ...(row?.value ?? {})
        } as T;
      },
      update: async (patch) => {
        const current = await this.singletonContent<T>(key).get();
        const value = { ...current, ...patch };
        const row = assertOk(
          await this.client
            .from("site_content")
            .upsert({ key, value, updated_at: new Date().toISOString() })
            .select("value")
            .single<{ value: T }>()
        );
        return assertRow(row, `Content ${key} was not found.`).value;
      }
    };
  }
}
