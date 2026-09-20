# Mug logo options — completed September 9, 2026

The Classic White, Travel, and Color Accent mugs each have one Shopify listing with Brown, Blue, Black, Sage, and Rust logo options. The existing Enamel Camp Mug pilot remains unchanged.

| Product | Shopify product | Printful sync product | Variants | Retail prices |
|---|---|---|---|---|
| Classic White Mug | 7544358207573 | 469379185 | 15: 11/15/20 oz × five logos | $8 / $11 / $13 |
| Travel Mug | 7544461394005 | 469409364 | 10: 25/40 oz × five logos | $29.50 / $31 |
| Color Accent Mug | 7544475582549 | 469413231 | 80: 16 physical combinations × five logos | 11 oz $11; 15 oz $12 |

All three are active and published to the Online Store (publication 148809187413). The store's existing password protection remains in place. Original product choices and approved pricing were preserved; new Travel and Accent prices follow the existing 30% markup and half-dollar rounding.

## Artwork and placement

- Normalized source palette: `public/brand/printful/full-logo-normalized-all-colors-v3/`. All eight source colors remain available for other product types.
- Ceramic wrap: `public/brand/printful/ceramic-mug-aligned-v1/`, 5400×2100 at 600 DPI (9×3.5 inches), visible ink 1770×1509 at (3345,295). Five chosen colors share the same alpha and placement. Printful file IDs: Brown 1064738649, Blue 1064738653, Black 1064738641, Sage 1064738652, Rust 1064738648.
- Classic White: 11 and 15 oz centered; 20 oz uses Position Right and vertical center. All 15 saved print files and assigned images checked. Twelve logo comparisons have zero offset.
- Travel: `public/brand/printful/travel-mug-aligned-v1/` contains ten size-specific canvases and a geometry/hash manifest. 25 oz is 5400×2280 at 600 DPI, visible ink 2346×2000 at (3054,140). 40 oz is 6426×3142, visible ink 2772×2363 at (3654,390). Both saved Printful editors visually checked: one file, 600 DPI, 9×3.8 and 10.71×5.24 inches respectively. Eight logo comparisons have zero offset.
- Accent: ceramic 9×3.5-inch wrap centered in each physical print area (11 oz 9×3.5; 15 oz 9×3.8). Both saved editors visually checked for a single 600 DPI layer and correct handle-right placement. All 80 mockups reviewed; 64 logo comparisons have zero offset.
- QA evidence: `output/mug-qa/{classic,travel,accent}/` has contact sheets and alignment reports. Production mappings and Shopify fulfillment/media verification are saved in `output/mug-qa/api-sync-verification.json` and `output/mug-qa/shopify-api-verification.json`.

## Physical catalog mappings

Travel catalog 663: White 25 oz 16440, White 40 oz 19514.

Accent catalog 403:
| Accent color | 11 oz | 15 oz |
|---|---|---|
| Black | 11051 | 17196 |
| Dark Blue | 17362 | 22373 |
| Red | 11049 | 17200 |
| Dark Green | 17359 | 17360 |
| Orange | 12579 | — |
| Blue | 11050 | 17197 |
| Pink | 12578 | 17199 |
| Golden Yellow | 17358 | — |
| Green | 17361 | — |
| Yellow | 11048 | — |

There are 80 actual combinations, not 100. Unsupported sizes were not fabricated.

## API workflow validated

Use Shopify plugin for product/options/variants/media/publication and fulfillment activation. Inspect GraphQL schema and validate operations first. Use Printful Ecommerce Platform Sync API `/sync/...` with account token read locally and `X-PF-Store-Id: 18715291`; never copy the token into this repository or logs. The manual/API-store `/store/...` endpoint is not used.

For new Shopify products:
1. Create the Shopify listing with all real physical combinations and logo options.
2. Enable Printful's “Import not synced products from Shopify” and allow import. Imported draft variants initially may be ignored.
3. Configure each `/sync/variant/@{ShopifyVariantId}` with the catalog variant, approved retail price/SKU, `is_ignored:false`, a single default artwork file, and supported options. Use full-size transparent canvases to preserve placement because the sync File object does not expose the editor's transform fields.
4. Generate Printful mockups using supported catalog print-area coordinates. For these products, API Flat “Left” is the Travel handle-right logo view; Flat “Right” is the Accent handle-right logo view. Opposite views are blank reverse sides. Check actual output before batch generation.
5. Upload mockups through Shopify, attach product media, then associate exactly one corresponding image with every variant.
6. Verify Printful-created inventory at Printful location 75165401173. Activate that location and deactivate the empty Shop location 75163435093. No quantities were invented or manually set; all available quantities were supplied by Printful (9999 per variant).
7. Verify shipping profile by size: Accent 11 oz 91744272469; Accent 15 oz 91744305237; Travel both sizes 91745157205. Printful created/associated these profiles automatically.
8. Publish to existing Online Store publication 148809187413 after mapping and visual checks.

Printful product-template API provides metadata; do not assume an API publishing endpoint or saved transform data. Catalog/files/mockup APIs were supported. Respect Printful rate-limit response headers and retry delays.

## Customer checks

- Classic: tested 11 oz Brown/Blue, 15 oz Black/Sage, 20 oz Rust. Correct five cart lines, images, prices, total $51. Test cart cleared and confirmed empty.
- Travel: tested 25 oz Brown/Blue/Black and 40 oz Sage/Rust. Correct five cart lines, images, prices, total $150.50. Test cart cleared and confirmed empty.
- Accent: tested Black/11 oz/Brown, Red/15 oz/Blue, Pink/15 oz/Black, Green/11 oz/Sage, Yellow/11 oz/Rust. All five distinct cart lines had the correct image, options, quantity 1, and price; total $57. Green/15 oz correctly disabled purchase as unavailable. All five test items removed individually; empty cart confirmed.
- No orders were placed or checkout entered.

## Durable resume data

Travel template 107112640; Accent template 107110049; Classic template 107109926. One existing listing per product; do not create duplicates.
Current browser Printful store: https://www.printful.com/dashboard/product-templates/published/18715291

Credential-free variant, artwork, and media maps are preserved in `output/mug-qa/api-resume/`. Temporary API job/media maps also remain in `/tmp/travel-file-map.json`, `/tmp/travel-ready-mockups.json`, `/tmp/accent-api-jobs.json`, `/tmp/accent-right-ready.json`, and `/tmp/accent-uploaded-media.json`. The Accent “right” file is the correct mockup set; earlier “final-tasks”/“ready-mockups” temporary files contain discarded reverse views. Resume from saved live mappings and durable verification files, not from old partial checkpoints.
