# Real merchandise preview — September 9, 2026

Theme: Sourdough House - design preview, 139515527253, remains UNPUBLISHED.
Active theme: Horizon - matching shirt galleries, 139625693269. No theme publication, DNS, or checkout changes.

## Catalog organization
25 active products inspected, complete pagination. Added additive `sdh-*` collection tags; existing artwork/gallery tags preserved. Imported Printful product types were unsuitable for browsing (for example, the tote was T-SHIRT), so tag rules provide deliberate, predictable grouping without altering fulfillment fields or tax categories.

| Collection | Count | Tag | Shopify ID |
|---|---:|---|---:|
| Apparel | 16 | sdh-apparel | 307212189781 |
| Shirts | 11 | sdh-shirts | 307021545557 |
| Hoodies | 4 | sdh-hoodies | 307021578325 |
| Mugs | 4 | sdh-mugs | 307021611093 |
| Accessories | 5 | sdh-accessories | 307212222549 |
| Baking Sayings | 7 | sdh-baking-sayings | 307212255317 |

All six collections published to Online Store 148809187413. Collections are store-wide data; design changes are draft-only. Shirts/Hoodies/Mugs reused existing collections and replaced their nonmatching taxonomy rules with tag rules. Empty Sweatshirts, Aprons, and Towels definitions retained and excluded from preview navigation. Apron is currently grouped in Accessories. Shorts are in Apparel. Baking Sayings overlaps Shirts; no products duplicated. Future products require appropriate collection tags; adding a product to Printful does not automatically classify it.

## Theme changes
Replaced the sample homepage with four editable category cards (Apparel, Mugs, Accessories, Baking Sayings) and six selected real products. Product images, prices, availability and links come from Shopify. Featured selections and category card images are editable in the theme editor. Existing brand logo, fonts, palette, header, footer, and bakery navigation preserved.

Added category navigation on collection and product pages. Native collection filtering/sorting, product variants, cart and recommendations retained. Copied the proven selected-color gallery snippet into this draft, so saying shirts show their matching front/sleeve pair.

On September 10, the 16 Apparel products received deliberate default colors instead of an inconsistent black/white mix. Shopify's first variant and featured front media now match for every product, including Brown Triblend for the sayings shirts, Black Heather for standard hoodies, Storm for crop hoodies, Teal Triblend for the full-logo tee, and product-specific medium-dark defaults for the remaining garments. See `shopify-apparel-default-colors-2026-09-10.md`.

The shared product template now presents every option containing “color” as a compact 34 px rounded-square swatch with the selected name shown once. Size and other non-color options remain short text buttons. This applies automatically to apparel, mug colors, and mug logo colors. The 16-color shirt, three-color crop hoodie, and 80-variant Color Accent Mug were tested in the draft; selections updated the variant URL and matching gallery without horizontal page overflow.

All 25 active product titles were shortened on September 10 by removing the repeated “Sourdough House Bakery” prefix and avoiding the internal “SDHB” abbreviation. Saying products lead with the saying, logo products use a short visual descriptor, and standard products use their familiar product name. Shopify read-back matched the approved title map for all 25 products, every existing handle was preserved, and no active title retains either prefix. Apparel, Mugs, Accessories, and representative saying, logo garment, mug, and beanie product pages were verified in the draft. The exact map is recorded in `plans/2026-09-10-shopify-product-title-design.md`.

## Verification
- Eight changed files passed official Shopify Theme Check; saved files read back and match, including semantic JSON comparison.
- Desktop homepage and Apparel collection reviewed visually; category links returned expected counts.
- Baking Sayings returned seven products; Crumb Queen changed from black front/sleeve to white front/sleeve correctly.
- Branded cart test: White XS Crumb Queen variant 42971651932245, quantity 1, $29.00. Removed test line and confirmed original empty cart restored. No checkout/order.
- Mobile 390px homepage and product inspected; no horizontal overflow. Mobile menu opens and Escape closes it with focus restored.
- Tablet 820px homepage inspected, no overflow. Browser viewport override reset.
- Draft stays unpublished for owner review; launch/domain/checkout configuration remains separate.

Preview accessible through Shopify Themes > Sourdough House - design preview > Preview. Editor: https://admin.shopify.com/store/ku4tbz-mj/themes/139515527253/editor

Source theme worktree: `/private/tmp/sdh-shopify-theme`, branch `codex/shopify-theme`.
