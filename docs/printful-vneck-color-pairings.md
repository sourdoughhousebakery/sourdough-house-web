# Bella+Canvas 6405CVC: published logo color pairings

Verified September 9, 2026. User authorized publishing the pictured women’s relaxed V-neck and selecting logo ink for each garment color, retaining the original white/blue reference.

- Product: **Sourdough House Bakery Women’s Relaxed V-Neck T-Shirt**.
- Template `107251043`; DTG; front full logo plus outside back-neck dragonfly. Both sleeves empty.
- [Printful product](https://www.printful.com/dashboard/product-templates/published/18715291/469257307).
- [Shopify product](https://admin.shopify.com/store/ku4tbz-mj/products/7543996350549).
- One listing: 8 colors × 5 sizes (S, M, L, XL, 2XL) = 40 variants.
- Retail $23.50–$26.50; imperial and metric size guides.

| Garment colors | Front and outside-label ink | Size variants |
| --- | --- | --- |
| Solid Black Blend, Heather Navy, Dark Grey Heather, Heather Slate, Berry, Heather Mauve | Warm cream | 30 |
| Turquoise | Signature brown | 5 |
| Solid White Blend | Original sky blue | 5 |

Cream provides clear contrast on the darker fabrics and a soft complementary pairing with berry and mauve. Brown gives turquoise stronger definition than the original blue. White retains the sister’s original blue treatment. Pairings were reviewed using actual Printful garment renders.

## Files and geometry

| Ink | Front file / Printful ID | Outside-label file / Printful ID |
| --- | --- | --- |
| Warm cream | `04-sourdough-house-logo-warm-cream-alignment-v2.png` / `1063172331` | `04-sourdough-house-dragonfly-warm-cream.png` / `1062542074` |
| Signature brown | `01-sourdough-house-logo-signature-brown-alignment-v2.png` / `1063172327` | `01-sourdough-house-dragonfly-signature-brown.png` / `1062542078` |
| Sky blue, preserved | `08-sourdough-house-logo-sky-blue-alignment-v2.png` | `08-sourdough-house-dragonfly-sky-blue.png` |

The original blue front uses an 8.00 × 7.79-inch layer at 300 DPI. Its 2400 × 2337 source has transparent padding: alpha bounds (59,304)–(2377,2280), making the visible art approximately 7.727 × 6.587 inches.

The current cream and brown 4500 × 3836 sources are tightly cropped. Set these to **7.73 × 6.59 inches**, 582 DPI, to preserve the original visible artwork size. Adding them initially defaults to 12 × 10.23 inches, so accepting the default would enlarge the logo. Press Enter in the Transform width field and wait for the dependent height/render to update.

Keep the old blue layer temporarily as a positioning reference, align the replacement over its visible artwork, then delete the superseded layer in the design editor. At the 1267 × 1319 viewport, resized replacement bounds were approximately x737–950, y564–746; moving it up80 pixels aligned it at y484–666. Coordinates are evidence from this viewport, not universal values.

All outside-label files use **3.00 × 1.77 inches at 800 DPI**, centered in the existing label box. Use the detailed dragonfly files, not the separate low-resolution or embroidery variants. Keep one file layer per printed placement.

## Publishing and verification

Use the [published-variant procedure](printful-published-variant-workflow.md), selecting colors in groups and confirming all their sizes before Change print file. Replace both front and Outside label; do not add sleeve art.

For this model, Basic mockups defaults to Ghost as the first Main Mockup tile. Keep Front only and deselect Back, Left, and Right. The outside-label dragonfly remains in the fulfillment print files even though a separate back mockup is intentionally omitted from the storefront gallery. Leave Publish mockups checked.

The initial white back image was absent from Shopify, so the unchanged white/blue group was passed through the same two-view mockup publication to complete its gallery. Preserve white/blue as the main image. Shopify’s title was corrected directly when the initial wizard retained the generic title; Printful then reflected the saved branded title.

Initial verification: Printful Published showed **40 Synced**, with no unsynced or disabled variants. Shopify showed Active on Online Store, the saved branded title, and correct image association for all eight color groups of five sizes. The white/blue front was restored to first position after Printful regenerated its media; Shopify displayed Product saved with Save disabled.

## Placement and gallery correction — September 9, 2026

- Storefront review on the white V-neck made the low front placement apparent. Raised the front artwork approximately 0.7–0.75 inch without resizing it or changing the outside-label placement.
- Applied the correction to all 40 variants in three Printful groups: 30 warm-cream dark-color variants, five signature-brown Turquoise variants, and five sky-blue Solid White variants.
- Preserved the 7.73 × 6.59-inch cream and brown artwork and the padded 8.00 × 7.79-inch sky-blue artwork.
- Republished exactly one front mockup per garment color. Back, Left, and Right mockups were removed from the regenerated gallery set; the outside-label dragonfly remains configured for fulfillment.
- Sync API verification found eight colors × five sizes, all synced, all with the expected front and outside-label files, one valid preview each, and no exceptions.
- Visual storefront checks passed for Solid Black Blend, Turquoise, and Solid White Blend. All three show the raised placement and the intended ink treatment.
