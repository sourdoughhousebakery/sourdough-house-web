# Drinkware launch — September 10, 2026

Six Shopify listings were created, imported by the connected Printful store, and published to the Online Store. Glassware and can coolers remain out of scope.

| Listing | Shopify variants | Retail price | Printful catalog product |
| --- | ---: | ---: | ---: |
| Insulated Straw Tumbler | 19 | $27.00 | 742 |
| Latte Mug | 5 | $11.00 | 837 |
| Flip Straw Water Bottle | 10 | $35.50 | 848 |
| Copper Vacuum Insulated Bottle | 28 | $34.00 | 935 |
| Stainless Steel Water Bottle | 8 | $32.00 | 382 |
| Straw-Lid Water Bottle | 5 | $28.50 | 788 |

All 75 variants have a matching physical Printful variant, customer price, Shopify SKU, and one processed 300 DPI transparent logo canvas. The full saved mapping and independent Printful readback are in `output/printful-drinkware-launch/sync-mappings.json` and `output/printful-drinkware-launch/sync-verification.json`; the verification passed 75 of 75.

Printful inventory is present at the Printful location with availability 9999 per variant. The Shopify Shop location has zero available stock. Every variant has its own Printful-generated preview attached as Shopify product media and assigned to that specific variant. Each listing has a featured image, and all six are `ACTIVE` and published to the Online Store.

The per-variant preview mapping is recorded in `output/printful-drinkware-launch/variant-preview-map.json`. Shopify media readback confirmed 75 of 75 variants have an assigned image, and a storefront collection-page check confirmed the product cards display the mockups.

Representative CamelBak mockup tests remain in `output/printful-drinkware-launch/` for reference. The API `Front`, `Back`, and `Right` camera choices can show the wrapped artwork around the curved side or in reverse; the published gallery instead uses the Printful sync previews that correctly show the selected variant's product and art.

## Latte Mug placement correction — September 10, 2026

The original Latte Mug canvas centered the logo across the wrap, making it disappear around the side in the listing photo. This geometry and its five original file mappings are superseded by `output/latte-placement-fix/manifest.json` and `after.json`.

Shopify product `7546039763029`, Printful sync product `469925073`, catalog product `837` / variant `21352` (White, 12 oz): all five colors now use the same right-side placement. On the 1988 × 1196 pixel canvas at 300 DPI, the unchanged 671 × 574 pixel logo moved from (659, 311) to (1217, 311). Its original pixels, size, and vertical position were preserved. Printful editor inspection confirmed the saved Brown canvas occupies the full 6.63 × 3.99 inch area and its visible artwork is inside the safe print boundary on the right.

| Logo | Shopify variant | New Printful file |
| --- | --- | --- |
| Brown | 42974017355861 | 1065249419 |
| Blue | 42974020206677 | 1065249422 |
| Black | 42974020239445 | 1065249427 |
| Sage | 42974020272213 | 1065249431 |
| Rust | 42974020304981 | 1065249974 |

Printful API readback verified all five mappings synced with the correct catalog variant and processed file. New 1400 pixel Flat / Right mockups show the full logo with the handle on the right. Existing Shopify media contents were replaced in place, preserving media IDs, variant associations, and gallery order. All five media are READY; all five variants remain available at $11 with their existing Printful fulfillment location and shipping profile. No inventory quantities were changed. Shopify verification is saved in `output/latte-placement-fix/shopify-verification.json`.

Storefront checks confirmed Brown, Blue, Black, Sage, and Rust selections show their respective corrected images. The shared draft theme was not modified or published.

## Flip Straw Water Bottle forward-facing mockups — September 10, 2026

Shopify product `7546039828565`, Printful sync product `469925180`, catalog `848`: replaced all ten Shopify variant images with 1400 × 1400 Printful Flat / Left renders. This is the camera angle that faces the existing bakery logo directly; Front shows the logo wrapping around the side, and Right shows it through the reverse of the transparent bottle. The earlier camera assessment above is superseded by this visual verification.

Reused the live production canvases at their existing full 2914 × 1196 placement. No production files, artwork geometry, options, SKUs, prices, inventory, or publication settings were changed. Updated existing Shopify media contents in place, preserving all ten variant associations, gallery order, and featured media ID. Shopify readback verified all ten media READY at 1400 pixels and exact preservation of the queried variants, prices, SKUs, and media mappings.

Storefront preview checks confirmed the forward-facing Charcoal/Warm Cream, Oxford Blue/Warm Cream, and Clear/Rust images and correct option transitions. Durable before/after records, generator requests/results, rendered images, and upload mapping are in `output/camelbak-forward-fix/`; main image upload is recorded separately in `main-update.json`.
