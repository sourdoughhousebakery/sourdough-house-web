import fs from 'node:fs';

const root = new URL('../', import.meta.url);
const statusPath = new URL('../output/printful-drinkware-launch/printful-file-status.json', import.meta.url);
const outputPath = new URL('../output/printful-drinkware-launch/sync-mappings.json', import.meta.url);
const token = fs.readFileSync('/Users/mattbruce/printful-token.txt', 'utf8').trim();
const headers = {
  Authorization: `Bearer ${token}`,
  'X-PF-Store-Id': '18715291',
  'Content-Type': 'application/json',
};

const files = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
const fileByArtwork = new Map(files.map((file) => [`${file.key}/${file.color}`, file]));
const compact = (value) => value.toLowerCase().replaceAll(' ', '').replace('Warm Cream', 'Cream').replace('Honey Gold', 'Gold');
const skuColor = (value) => ({ 'Warm Cream': 'CREAM', 'Honey Gold': 'GOLD' }[value] ?? value.toUpperCase());

const products = [
  {
    key: 'tumbler', title: 'Insulated Straw Tumbler', price: '27.00', skuPrefix: 'SHB-TUM',
    ids: [42974017290325, ...Array.from({ length: 18 }, (_, i) => 42974019616853 + i * 32768)],
    catalog: { Black: 19107, Mint: 19108, Navy: 19109, Pink: 19110, White: 19111 },
    combinations: [['Black', ['Warm Cream', 'Honey Gold', 'White']], ['Mint', ['Brown', 'Blue', 'Black', 'Rust']], ['Navy', ['Warm Cream', 'Honey Gold', 'White']], ['Pink', ['Brown', 'Blue', 'Black', 'Rust']], ['White', ['Brown', 'Blue', 'Black', 'Sage', 'Rust']]],
  },
  {
    key: 'latte', title: 'Latte Mug', price: '11.00', skuPrefix: 'SHB-LATTE',
    ids: [42974017355861, ...Array.from({ length: 4 }, (_, i) => 42974020206677 + i * 32768)],
    catalog: { White: 21352 },
    combinations: [['White', ['Brown', 'Blue', 'Black', 'Sage', 'Rust']]],
  },
  {
    key: 'camelbak', title: 'Flip Straw Water Bottle', price: '35.50', skuPrefix: 'SHB-CAMEL',
    ids: [42974017421397, ...Array.from({ length: 9 }, (_, i) => 42974020370517 + i * 32768)],
    catalog: { Charcoal: 22016, Clear: 22017, 'Oxford Blue': 22020 },
    combinations: [['Charcoal', ['Warm Cream', 'Honey Gold', 'White']], ['Clear', ['Brown', 'Blue', 'Black', 'Rust']], ['Oxford Blue', ['Warm Cream', 'Honey Gold', 'White']]],
  },
  {
    key: 'copper', title: 'Copper Vacuum Insulated Bottle', price: '34.00', skuPrefix: 'SHB-COPPER',
    ids: [42974017454165, ...Array.from({ length: 27 }, (_, i) => 42974020698197 + i * 32768)],
    catalog: { Black: 23880, Grey: 23883, 'Mint Green': 23884, Navy: 23881, Orange: 23885, 'Pebble Blue': 23886, Red: 23887, White: 23882 },
    combinations: [['Black', ['Warm Cream', 'Honey Gold', 'White']], ['Grey', ['Brown', 'Blue', 'Black', 'Rust']], ['Mint Green', ['Brown', 'Blue', 'Black', 'Rust']], ['Navy', ['Warm Cream', 'Honey Gold', 'White']], ['Orange', ['Black', 'Warm Cream', 'White']], ['Pebble Blue', ['Brown', 'Black', 'Rust']], ['Red', ['Black', 'Warm Cream', 'White']], ['White', ['Brown', 'Blue', 'Black', 'Sage', 'Rust']]],
  },
  {
    key: 'steel', title: 'Stainless Steel Water Bottle', price: '32.00', skuPrefix: 'SHB-STEEL',
    ids: [42974017486933, ...Array.from({ length: 7 }, (_, i) => 42974021615701 + i * 32768)],
    catalog: { Black: 16030, White: 10798 },
    combinations: [['Black', ['Warm Cream', 'Honey Gold', 'White']], ['White', ['Brown', 'Blue', 'Black', 'Sage', 'Rust']]],
  },
  {
    key: 'straw', title: 'Straw-Lid Water Bottle', price: '28.50', skuPrefix: 'SHB-STRAW32',
    ids: [42974017585237, ...Array.from({ length: 4 }, (_, i) => 42974021877845 + i * 32768)],
    catalog: { White: 20175 },
    combinations: [['White', ['Brown', 'Blue', 'Black', 'Sage', 'Rust']]],
  },
];

const mappings = products.flatMap((product) => {
  const combos = product.combinations.flatMap(([color, logos]) => logos.map((logo) => ({ color, logo })));
  if (combos.length !== product.ids.length) throw new Error(`${product.title}: Shopify ID count mismatch`);
  return combos.map(({ color, logo }, index) => {
    const artwork = fileByArtwork.get(`${product.key}/${compact(logo).replaceAll('-', '')}`);
    // Artwork keys are lowercase slugs, not the customer-facing option labels.
    const colorKey = logo.toLowerCase().replaceAll(' ', '-');
    const asset = fileByArtwork.get(`${product.key}/${colorKey}`);
    if (!asset?.printfulFileId || asset.status !== 'ok') throw new Error(`${product.title}: missing ready file for ${logo}`);
    const physical = color === 'White' && product.key === 'latte' ? 'White' : color;
    return {
      productKey: product.key,
      productTitle: product.title,
      shopifyVariantId: String(product.ids[index]),
      physicalColor: physical,
      logoColor: logo,
      catalogVariantId: product.catalog[physical],
      retailPrice: product.price,
      sku: ['latte', 'straw'].includes(product.key)
        ? `${product.skuPrefix}-${skuColor(logo)}`
        : `${product.skuPrefix}-${compact(physical).toUpperCase()}-${skuColor(logo)}`,
      productionFileId: asset.printfulFileId,
      productionFilename: asset.filename,
    };
  });
});

const pause = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
async function putMapping(mapping) {
  const body = {
    variant_id: mapping.catalogVariantId,
    retail_price: mapping.retailPrice,
    sku: mapping.sku,
    is_ignored: false,
    files: [{ type: 'default', id: mapping.productionFileId }],
    options: [],
  };
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetch(`https://api.printful.com/sync/variant/@${mapping.shopifyVariantId}`, { method: 'PUT', headers, body: JSON.stringify(body) });
    const result = await response.json();
    if (response.status === 429) { await pause(Number(response.headers.get('retry-after') ?? 2) * 1000); continue; }
    if (!response.ok) throw new Error(`${mapping.sku}: HTTP ${response.status} ${JSON.stringify(result)}`);
    return { ...mapping, response: result.result };
  }
  throw new Error(`${mapping.sku}: rate-limited after retries`);
}

const saved = [];
for (const mapping of mappings) {
  saved.push(await putMapping(mapping));
  fs.writeFileSync(outputPath, JSON.stringify(saved, null, 2) + '\n');
}
console.log(JSON.stringify({ mapped: saved.length, products: Object.fromEntries(products.map(({ key }) => [key, saved.filter((row) => row.productKey === key).length])) }));
