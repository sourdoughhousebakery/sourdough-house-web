import type {
  EditableAnnouncement,
  EditableContact,
  EditableTestimonial
} from "@/lib/admin-content/content";
import type { BakeCatalogItem, PublicCatalogItem } from "@/lib/catalog/types";

export type ImageAsset = {
  url: string;
};

export interface CatalogRepository {
  list(): Promise<BakeCatalogItem[]>;
  listPublic(): Promise<PublicCatalogItem[]>;
  listFeatured(limit?: number): Promise<PublicCatalogItem[]>;
  get(id: string): Promise<BakeCatalogItem | null>;
  create(input?: Partial<BakeCatalogItem>): Promise<BakeCatalogItem>;
  update(id: string, patch: Partial<BakeCatalogItem>): Promise<BakeCatalogItem>;
  delete(id: string): Promise<void>;
}

export interface CategoryRepository {
  list(): Promise<string[]>;
  create(name: string): Promise<string[]>;
  delete(name: string): Promise<string[]>;
}

export interface SingletonRepository<T> {
  get(): Promise<T>;
  update(patch: Partial<T>): Promise<T>;
}

export interface CrudRepository<T> {
  list(): Promise<T[]>;
  get(id: string): Promise<T | null>;
  create(input?: Partial<T>): Promise<T>;
  update(id: string, patch: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

export interface AssetRepository {
  link(url: string): Promise<ImageAsset>;
  upload(file: File): Promise<ImageAsset>;
}

export interface AdminDataSource {
  catalog: CatalogRepository;
  categories: CategoryRepository;
  announcement: SingletonRepository<EditableAnnouncement>;
  contact: SingletonRepository<EditableContact>;
  testimonials: CrudRepository<EditableTestimonial>;
  assets: AssetRepository;
}
