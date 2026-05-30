import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";

async function loadLocalEnv() {
  try {
    const raw = await readFile(new URL("../.env.local", import.meta.url), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [key, ...valueParts] = trimmed.split("=");
      if (!key || process.env[key] !== undefined) continue;
      process.env[key] = valueParts.join("=").replace(/^['"]|['"]$/g, "");
    }
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}

await loadLocalEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!url || !secretKey) {
  throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY before running this script.");
}

const supabase = createClient(url, secretKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

function readJson(path) {
  return readFile(new URL(path, import.meta.url), "utf8").then((raw) => JSON.parse(raw));
}

function catalogItemToRow(item, index) {
  return {
    id: item.id,
    name: item.name,
    description: item.description ?? "",
    category: item.category ?? "Bakery",
    image: item.image ?? "",
    price: item.price ?? "",
    note: item.note ?? null,
    is_active: Boolean(item.isActive),
    is_featured: Boolean(item.isFeatured),
    is_typically_available: Boolean(item.isTypicallyAvailable),
    show_price: Boolean(item.showPrice),
    sort_order: index
  };
}

function testimonialToRow(testimonial, index) {
  return {
    id: testimonial.id,
    quote: testimonial.quote,
    name: testimonial.name,
    source: testimonial.source,
    is_active: Boolean(testimonial.isActive),
    sort_order: index
  };
}

async function assertOk(result, label) {
  const resolved = await result;
  if (resolved.error) throw new Error(`${label}: ${resolved.error.message}`);
  return resolved.data;
}

const [catalogItems, categories, content] = await Promise.all([
  readJson("../data/catalog-items.json"),
  readJson("../data/catalog-categories.json"),
  readJson("../data/admin-content.json")
]);

await assertOk(
  supabase.from("catalog_items").upsert(catalogItems.map(catalogItemToRow)),
  "seed catalog_items"
);

await assertOk(
  supabase.from("catalog_categories").upsert(categories.map((name, sort_order) => ({ name, sort_order }))),
  "seed catalog_categories"
);

await assertOk(
  supabase.from("site_content").upsert([
    { key: "hero", value: content.hero },
    { key: "announcement", value: content.announcement },
    { key: "contact", value: content.contact }
  ]),
  "seed site_content"
);

await assertOk(
  supabase.from("testimonials").upsert(content.testimonials.map(testimonialToRow)),
  "seed testimonials"
);

console.log("Seeded Supabase admin data.");
