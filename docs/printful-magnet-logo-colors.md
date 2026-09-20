# Bakery Logo Magnet color expansion

Updated September 10, 2026, at the user's request to add all suitable logo colors.

- Shopify product: `7544528732245`, handle `sourdough-house-bakery-logo-magnet`.
- Printful Shopify store: `18715291`; sync product: `469439106`; catalog product: `656`.
- One listing, Size then Logo color: Black, Brown, Blue, Sage, Rust, Honey Gold.
- 18 variants: six colors across 3″×3″ ($4.50), 4″×4″ ($5.50), and 6″×6″ ($8.00). The original three black variant IDs, prices, images, title, description, publication, and URL were preserved.
- White and Warm Cream were excluded because the magnet face is white. Honey Gold remains visibly distinct in the actual mockup.

## Production artwork

Reuse the original detailed dragonfly palette from File Library > Logo > Dragonfly > Hi Resolution (`26284101`), not the simplified embroidery palette. All originals are 2400×1419 at 300 DPI.

| Logo color | Printful production file ID |
| --- | --- |
| Black | 1062560618 |
| Brown | 1062542078 |
| Blue | 1062560625 |
| Sage | 1062560623 |
| Rust | 1062560621 |
| Honey Gold | 1062560617 |

Catalog mapping: 3-inch `16366`, 4-inch `16367`, 6-inch `16465`. Each variant has one default print placement; Printful adds an empty `license_type` option during mapping.

Direct sync API artwork assignments default to full-width placement (3/4/6 inches). After mapping, each new logo's three sizes were selected together in the browser and corrected in Transform to 2.72 inches on the 3-inch variant. This propagates to 3.63 inches on the 4-inch variant and 5.44 inches on the 6-inch variant, matching the original black design scale. Saved with Publish mockups unchecked to preserve Shopify media. Honey Gold was reopened after saving and verified at 2.72×1.61 (882 DPI), 3.63×2.14 (662 DPI), and 5.44×3.22 (441 DPI), one intended logo layer each. The original 4-inch editor displayed height 2.15; the corrected ratio displays 2.14 due to two-decimal rounding.

Do not repeat sync PUT operations on the completed variants merely to refresh state: the browser-saved geometry must be preserved.

## Images and verification

- 15 Printful Flat/Front mockups generated and attached, with correct Shopify media association per new size/color variant. Original black media retained.
- Mockup geometry: 900×900 area, image 816×482.46 at (42,208.77), proportional for every size. The black pilot matched existing preview ink bounds within 1–2 pixels on a 1000-pixel comparison.
- All six color masters have the same preview dimensions and ink bounds. The 18-image review board was visually checked, including Honey Gold.
- Final Printful read: 18/18 synced, not ignored, correct catalog IDs, production files, retail prices, and active availability.
- Shopify: all 18 available with supplier-reported quantity 9999, Printful as sole inventory location, and existing delivery profile `91745681493` (Die-cut magnets, car magnets and can coolers).
- Existing Online Store and Microsoft Copilot publications retained. No orders were submitted.
- Storefront verified six logo swatches, correct image/color switching, and cart lines for 6-inch Honey Gold at $8.00 and 4-inch Blue at $5.50. Changing size retained the selected logo; changing logo retained the selected size. Both test items were removed individually and the empty cart was confirmed. The page was left on 4-inch Blue.
- Final Shopify reread after all browser saves confirmed all 18 variants, all 18 images, correct per-variant media associations and prices, and available-for-sale status without mismatches (`shopify-final.json`).

Durable state, before/after snapshots, file metadata, requests, mockup tasks, media mappings, and verification reports: `output/printful-magnet-colors/`. `shopify-created.json` records exact new variant IDs. `shopify-uploads.json` records all new media IDs. `mockup-review.png` is an analysis contact sheet, not an additional storefront image.

Printful rate limits observed during execution: sync PUTs throttled after ten rapid requests; mockup generation also required backoff. Requests were checkpointed, actual state was reread, and only unfinished mappings/tasks were resumed.
