import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const masters = path.join(root, "public/brand/printful/full-logo-normalized-all-colors-v3");
const output = path.join(root, "output/printful-drinkware-launch/assets");

const products = [
  { key: "insulated-straw-tumbler", catalogId: 742, width: 3017, height: 1200 },
  { key: "latte-mug", catalogId: 837, width: 1988, height: 1196 },
  { key: "camelbak-flip-straw-water-bottle", catalogId: 848, width: 2914, height: 1196 },
  { key: "copper-vacuum-insulated-bottle", catalogId: 935, width: 2751, height: 1200 },
  { key: "stainless-steel-water-bottle", catalogId: 382, width: 2557, height: 1582 },
  { key: "straw-lid-water-bottle", catalogId: 788, width: 3402, height: 2091 },
];

const colors = ["brown", "blue", "black", "sage", "rust", "honey-gold", "white", "warm-cream"];

async function createCanvas(product, color) {
  const source = path.join(masters, `shb-full-logo-${color}-normalized-v3.png`);
  const logoHeight = Math.round(product.height * 0.48);
  const logo = await sharp(source)
    .resize({ height: logoHeight, fit: "inside", withoutEnlargement: true })
    .png()
    .toBuffer();
  const metadata = await sharp(logo).metadata();
  const left = Math.round((product.width - metadata.width) / 2);
  const top = Math.round((product.height - metadata.height) / 2);
  const filename = `${product.key}-${color}-300dpi.png`;
  const destination = path.join(output, filename);

  await sharp({
    create: {
      width: product.width,
      height: product.height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: logo, left, top }])
    .withMetadata({ density: 300 })
    .png()
    .toFile(destination);

  const image = await sharp(destination).ensureAlpha().raw().toBuffer();
  return {
    catalogId: product.catalogId,
    product: product.key,
    color,
    file: filename,
    pixels: [product.width, product.height],
    dpi: 300,
    logoPixels: [metadata.width, metadata.height],
    logoTopLeft: [left, top],
    alphaSha256: crypto.createHash("sha256").update(image).digest("hex"),
  };
}

await fs.rm(output, { recursive: true, force: true });
await fs.mkdir(output, { recursive: true });
const manifest = [];
for (const product of products) {
  for (const color of colors) manifest.push(await createCanvas(product, color));
}
await fs.writeFile(path.join(output, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Created ${manifest.length} Printful-ready canvases in ${output}`);
