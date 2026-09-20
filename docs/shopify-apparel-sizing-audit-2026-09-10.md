# Shopify apparel sizing audit — September 10, 2026

Checked the complete live catalog: 25 products, including 16 apparel listings and 3 wearable accessories (two beanies and the apron).

Added missing size guides to 11 existing product descriptions: all seven baking-sayings T-shirts, both regular hoodies, and both crop hoodies. Each new guide covers every offered size, includes inches and centimeters, explains how to measure garment length and flat chest width, and preserves Printful’s measurement tolerance.

The live Printful sync mappings confirmed Bella+Canvas 3413 / catalog 162 for the sayings tees, Bella+Canvas 3719 / catalog 294 for regular hoodies, and Bella+Canvas 7502 / catalog 317 for crop hoodies. New chart values came from Printful’s product measurement tables via GET /products/{id}/sizes?unit=inches%2Ccm. Only sizes actually offered in each listing were included.

The five other apparel listings and three wearable accessories already contained imperial and metric size charts. Their descriptions were preserved.

Verification: reread all 19 Shopify products after the edits; every chart covers its product’s full Printful-synced size set. All 11 added chart payloads match the supplier values. Existing description content, product titles, status, tags, and variant counts were preserved. Storefront preview checks confirmed the tables render on Born to Bake T-Shirt, Front Logo Hoodie, and Front Logo Crop Hoodie. No theme publication was performed.

Evidence and description backups: `output/sizing-audit-2026-09-10/` contains Shopify before/after snapshots, Printful variant mappings and source charts, proposed update payloads, and `verification.json`.
