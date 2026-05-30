import { describe, expect, it } from "vitest";
import { getDefaultAdminContent } from "@/lib/admin-content/content";
import type { BakeCatalogItem } from "@/lib/catalog/types";
import { LocalAdminDataSource, localCatalogStorageKey } from "./local";

const catalogItems: BakeCatalogItem[] = [
  {
    id: "country",
    name: "Country Sourdough",
    description: "Classic loaf",
    category: "Bread",
    image: "https://example.com/country.jpg",
    price: "$10",
    isActive: true,
    isFeatured: true,
    isTypicallyAvailable: true,
    showPrice: true
  }
];

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  readonly length = 0;

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

function makeDataSource() {
  return new LocalAdminDataSource({
    defaultCatalogItems: catalogItems,
    defaultContent: getDefaultAdminContent(),
    storage: new MemoryStorage()
  });
}

describe("LocalAdminDataSource", () => {
  it("performs catalog CRUD against JSON storage", async () => {
    const dataSource = makeDataSource();

    const created = await dataSource.catalog.create({ name: "Seeded Rye", category: "Bread", isFeatured: true });
    await dataSource.catalog.update(created.id, { price: "$12", showPrice: true });

    expect((await dataSource.catalog.list()).map((item) => item.name)).toEqual(["Country Sourdough", "Seeded Rye"]);
    expect(await dataSource.catalog.get(created.id)).toMatchObject({
      name: "Seeded Rye",
      price: "$12",
      showPrice: true
    });

    await dataSource.catalog.delete(created.id);
    expect((await dataSource.catalog.list()).map((item) => item.id)).toEqual(["country"]);
  });

  it("persists catalog changes using the legacy-compatible local key", async () => {
    const storage = new MemoryStorage();
    const dataSource = new LocalAdminDataSource({
      defaultCatalogItems: catalogItems,
      defaultContent: getDefaultAdminContent(),
      storage
    });

    await dataSource.catalog.create({ name: "Stored Bake" });

    expect(JSON.parse(storage.getItem(localCatalogStorageKey) ?? "[]")).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "Stored Bake" })])
    );
  });

  it("performs singleton content updates", async () => {
    const dataSource = makeDataSource();

    await dataSource.announcement.update({ title: "Friday drop", body: "Orders open at 9am.", isActive: true });
    await dataSource.contact.update({ email: "orders@example.com" });

    expect(await dataSource.announcement.get()).toMatchObject({ title: "Friday drop", isActive: true });
    expect(await dataSource.contact.get()).toMatchObject({ email: "orders@example.com" });
  });

  it("performs testimonial CRUD", async () => {
    const dataSource = makeDataSource();

    const created = await dataSource.testimonials.create({ name: "A Customer", quote: "Loved it." });
    await dataSource.testimonials.update(created.id, { source: "Email" });

    expect(await dataSource.testimonials.get(created.id)).toMatchObject({ source: "Email" });

    await dataSource.testimonials.delete(created.id);
    expect(await dataSource.testimonials.get(created.id)).toBeNull();
  });
});
