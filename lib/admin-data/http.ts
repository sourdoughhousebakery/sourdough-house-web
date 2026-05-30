"use client";

import type {
  EditableAnnouncement,
  EditableContact,
  EditableHero,
  EditableTestimonial
} from "@/lib/admin-content/content";
import type { BakeCatalogItem, PublicCatalogItem } from "@/lib/catalog/types";
import { adminContactChangeEvent } from "./events";
import type { AdminDataSource, AssetRepository, CatalogRepository, CategoryRepository, CrudRepository, ImageAsset, SingletonRepository } from "./types";

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...init?.headers
    }
  });
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Unable to read uploaded file."));
    };
    reader.onerror = () => reject(reader.error ?? new Error("Unable to read uploaded file."));
    reader.readAsDataURL(file);
  });
}

export class HttpAdminDataSource implements AdminDataSource {
  readonly catalog: CatalogRepository = {
    list: () => api<BakeCatalogItem[]>("/api/admin/catalog"),
    listPublic: () => api<PublicCatalogItem[]>("/api/admin/catalog/public"),
    listFeatured: (limit = 3) => api<PublicCatalogItem[]>(`/api/admin/catalog/featured?limit=${limit}`),
    get: (id) => api<BakeCatalogItem | null>(`/api/admin/catalog/${id}`),
    create: (input = {}) => api<BakeCatalogItem>("/api/admin/catalog", { method: "POST", body: JSON.stringify(input) }),
    update: (id, patch) => api<BakeCatalogItem>(`/api/admin/catalog/${id}`, { method: "PATCH", body: JSON.stringify(patch) }),
    delete: (id) => api<void>(`/api/admin/catalog/${id}`, { method: "DELETE" })
  };

  readonly categories: CategoryRepository = {
    list: () => api<string[]>("/api/admin/categories"),
    create: (name) => api<string[]>("/api/admin/categories", { method: "POST", body: JSON.stringify({ name }) }),
    delete: (name) => api<string[]>("/api/admin/categories", { method: "DELETE", body: JSON.stringify({ name }) })
  };

  readonly hero: SingletonRepository<EditableHero> = {
    get: () => api<EditableHero>("/api/admin/content/hero"),
    update: (patch) => api<EditableHero>("/api/admin/content/hero", { method: "PATCH", body: JSON.stringify(patch) })
  };

  readonly announcement: SingletonRepository<EditableAnnouncement> = {
    get: () => api<EditableAnnouncement>("/api/admin/content/announcement"),
    update: (patch) => api<EditableAnnouncement>("/api/admin/content/announcement", { method: "PATCH", body: JSON.stringify(patch) })
  };

  readonly contact: SingletonRepository<EditableContact> = {
    get: () => api<EditableContact>("/api/admin/content/contact"),
    update: async (patch) => {
      const contact = await api<EditableContact>("/api/admin/content/contact", { method: "PATCH", body: JSON.stringify(patch) });
      window.dispatchEvent(new Event(adminContactChangeEvent));
      return contact;
    }
  };

  readonly testimonials: CrudRepository<EditableTestimonial> = {
    list: () => api<EditableTestimonial[]>("/api/admin/content/testimonials"),
    get: (id) => api<EditableTestimonial | null>(`/api/admin/content/testimonials/${id}`),
    create: (input = {}) => api<EditableTestimonial>("/api/admin/content/testimonials", { method: "POST", body: JSON.stringify(input) }),
    update: (id, patch) => api<EditableTestimonial>(`/api/admin/content/testimonials/${id}`, { method: "PATCH", body: JSON.stringify(patch) }),
    delete: (id) => api<void>(`/api/admin/content/testimonials/${id}`, { method: "DELETE" })
  };

  readonly assets: AssetRepository = {
    link: (url) => Promise.resolve({ url }),
    upload: async (file) => {
      const url = await fileToDataUrl(file);
      return api<ImageAsset>("/api/admin/assets", { method: "POST", body: JSON.stringify({ url }) });
    }
  };
}
