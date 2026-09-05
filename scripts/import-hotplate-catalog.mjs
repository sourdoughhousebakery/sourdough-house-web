// One-time website import. Does not connect to or write to Hotplate.
// Preview: node --env-file=.env.local scripts/import-hotplate-catalog.mjs
// Apply:   node --env-file=.env.local scripts/import-hotplate-catalog.mjs --apply
import { createClient } from "@supabase/supabase-js";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const previousIds = ["catalog-mpsue98q", "catalog-mpsui0q7", "catalog-mpsuj64e", "catalog-mpsub9qj"];
const expectedIds = [
  "hotplate-italian-herb-cheddar", "hotplate-birthday-cake-cookies",
  "hotplate-lemon-blueberry-scones", "hotplate-cherry-pecan-scones",
  "hotplate-lemon-blueberry-cake", "hotplate-english-muffins"
];
const items = JSON.parse(await readFile(new URL("../data/catalog-items.json", import.meta.url), "utf8"));
if (items.length !== 6 || new Set(items.map((item) => item.id)).size !== 6 ||
    items.some((item) => !expectedIds.includes(item.id) || !item.isActive || !item.image || !item.description)) {
  throw new Error("Expected the six reviewed Hotplate catalog products.");
}
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});
function checked(result) {
  if (result.error) throw new Error(result.error.message);
  return result.data;
}
const existing = checked(await db.from("catalog_items").select("*").order("sort_order"));
const unexpected = existing.filter((item) => !previousIds.includes(item.id) && !expectedIds.includes(item.id));
if (unexpected.length) throw new Error("Catalog has changed since review; inspect the new records before importing.");

const imported = items.map((item, sort_order) => ({
  id: item.id, name: item.name, description: item.description, category: item.category,
  image: item.image, price: item.price, note: item.note ?? null,
  is_active: item.isActive, is_featured: item.isFeatured,
  is_typically_available: item.isTypicallyAvailable, show_price: item.showPrice, sort_order
}));
const archived = existing.filter((item) => previousIds.includes(item.id)).map((item) => ({
  id: item.id, name: item.name, description: item.description, category: item.category,
  image: item.image, price: item.price, note: item.note,
  is_active: false, is_featured: false, is_typically_available: item.is_typically_available,
  show_price: item.show_price, sort_order: item.sort_order
}));
console.log(JSON.stringify({ import: imported.map(({ name, price }) => ({ name, price })), hide: archived.map(({ name }) => name) }, null, 2));
if (!process.argv.includes("--apply")) process.exit(0);

const backupDir = resolve(".qa/catalog-backups");
await mkdir(backupDir, { recursive: true });
const backupPath = resolve(backupDir, `${new Date().toISOString().replaceAll(":", "-")}.json`);
await writeFile(backupPath, JSON.stringify(existing, null, 2) + "\n", { flag: "wx" });
const categories = [...new Set(items.map((item) => item.category))];
checked(await db.from("catalog_categories").upsert(categories.map((name) => ({ name })), { onConflict: "name" }));
// One statement activates replacements and hides old records. Old records remain recoverable.
checked(await db.from("catalog_items").upsert([...imported, ...archived], { onConflict: "id" }));
const active = checked(await db.from("catalog_items").select("*").eq("is_active", true).order("sort_order"));
if (active.length !== 6 || active.some((row, index) =>
  Object.entries(imported[index]).some(([key, value]) => row[key] !== value))) {
  throw new Error("Catalog verification failed; inspect records and backup before continuing.");
}
console.log(`Verified all six website catalog records. Previous data backed up at ${backupPath}`);
