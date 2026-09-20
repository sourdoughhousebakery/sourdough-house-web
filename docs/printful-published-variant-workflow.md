# Printful: one listing with light- and dark-garment logos

Verified pilot: September 9, 2026. This is a post-publication workflow. Publish only when the user has authorized publishing that product.

## Bella+Canvas 3413 full-logo pilot

- Template: `LVL 3 | Logo - Full | Tee BELLA+CANVAS 3413 | DTFlex`.
- Published title: **Sourdough House Bakery Full Logo T-Shirt**.
- Store: **My Store** (Shopify), Printful store `18715291`.
- [Printful product](https://www.printful.com/dashboard/product-templates/published/18715291/469194529).
- [Shopify product](https://admin.shopify.com/store/ku4tbz-mj/products/7543716937813).
- One listing, 16 colors × six sizes (XS, S, M, L, XL, 2XL) = **96 variants**.
- Retail price: $25.50–$28.50.
- Front only; both sleeve placements and back placements are empty.
- Main gallery image: Solid Black Triblend, cream full logo.

| Garment colors | Logo | Variants |
| --- | --- | --- |
| Tan Triblend, Oatmeal Triblend, White Fleck Triblend, Solid White Triblend | Signature brown | 24 |
| Solid Black, Brown, True Royal, Navy, Teal, Maroon, Berry, Purple, Red, Blue, Olive, Mauve (all Triblend) | Existing warm cream | 72 |

The brown file is `01-sourdough-house-logo-signature-brown-alignment-v2.png`, Printful file `1063172327`, 4500 × 3836 pixels. Both ink treatments use a 12.00 × 10.23-inch front layer, 375 DPI. These dimensions describe this full-logo pilot only; other artwork needs its own placement inspection.

## Reusable procedure

1. My products → Published → choose **My Store** → **Edit** the exact product.
2. Click all target garment-color swatches. Confirm the resulting variant rows contain exactly those colors and all intended sizes.
3. Use the header checkbox to select all filtered variants. Confirm the expected count (four colors × six sizes = 24 in this pilot).
4. Click **Change print file**. Confirm the design editor's variant strip includes only the selected colors.
5. Inspect every placement tab and its layers. Change only monochrome logos that need contrast correction; preserve multicolor front art when changing a sleeve logo. Do not add printing to empty placements.
6. Record the existing filename, layer count, width, height, DPI, and visible position before replacement.
7. Open **Uploads** and search the File library for the exact existing alternate-color logo. Verify the thumbnail, filename, pixel dimensions, and file ID.
8. Applying a library file **adds a layer**. In Layers, remove the old logo layer from the selected variants, leaving exactly one replacement logo. Keep the library source files. In this pilot, the replacement automatically matched the original size and position; verify this rather than assuming it for another design.
9. Inspect rendered previews for every selected color. Wait for renders to finish; initially blank or stale previews are not evidence. Confirm readability, size, collar clearance, complete edges, and at least 300 DPI.
10. **Proceed to mockups → Basic mockups**. For this front-only pilot, use **Ghost** (second tile in Main Mockup), keep **Front** selected, deselect **Back**, **Left**, and **Right**, and leave **Publish mockups** checked. Verify one completed front preview for each changed color, then **Continue** to submit.
11. Reload the product. Refilter/reselect the changed variants and reopen **Change print file** to verify the persisted file, size, and selected-color set. Close without saving additional changes.
12. Verify Shopify's saved gallery and variant image associations. Preserve the original main image and other colors' images. Confirm all original colors and sizes remain in the single listing.

### Storefront media cleanup after mockup publication

Printful can append regenerated mockups without removing superseded Shopify media. After every post-publication mockup change:

1. Read the Shopify product again and inventory every retained image by garment color and view.
2. For a front-only customer gallery, keep one front image per color. A sleeve or outside-label print can remain configured for fulfillment without a dedicated storefront image.
3. For a true front/back product, keep exactly one front and one back image per color and put the printed front first.
4. Remove older duplicate, blank, side, and wrong-angle media after the replacement images are confirmed present.
5. Replace generic `Product mockup` alt text with `Product title — Color — front/back`. The draft theme uses the color label to show only the selected color's images.
6. Reload the storefront after metadata changes. Verify at least one dark and one light selection, and confirm the collection card still uses the printed front.

## Publication notes

- The initial Publish wizard and the post-publication mockup wizard are different interfaces.
- Initial publishing: select the printed front style and filter Placement to Front before Select all. The initial default can select blank backs and side views.
- Printful can show the generic title while Shopify already has the saved custom title. Check Shopify admin and reload Printful before assuming a title edit failed.
- My Store was password protected during the pilot. The Shopify listing is Active, but public access follows the store's existing password setting.
- For a product with actual sleeve printing, follow the chosen storefront presentation: either a selected-color front/sleeve pair or one front image per color. In both cases, verify the sleeve production file separately in Printful.

## Add colors to an existing listing

Verified September 9, 2026 with both Yupoong 1501KC beanies. Use this when additional garment colors are missing from an already published product. A duplicated template does not need to be republished.

1. Published → My Store → Edit the existing product → three-dot menu next to Edit design → **Add variants**.
2. Compare the available colors with the existing store variants and the user's expanded template. Explicitly select only missing colors and intended sizes. The wizard may start with existing colors selected, so inspect rather than accept the defaults.
3. The **These variants are in your store already** section states that existing variants won't be updated. Use Change print file separately if an existing color needs correction.
4. Inspect the inherited artwork and geometry. For standard embroidery, use **Color & details** to map thread colors; preserve the original PNG and placement. Both beanies used 1800 Black on the new light colors.
5. **Choose mockups → Basic mockups** → select the matching plain-front **Flat 2** style → review every new color → **Continue**.
6. Verify prices in **Configure prices**, then **Submit to store**. Both beanies retained $17 per variant. This adds variants to the original Shopify product.
7. Verify the new variant rows, prices, image associations, and gallery in Shopify, then the synced counts in Printful. Existing main images remained first in these additions.

Both beanies now have 12 colors × One size. User-created expanded templates remain unpublished working copies; the existing store products and URLs were preserved.

## Correct an existing front placement

Verified September 9, 2026 on all 96 Bella+Canvas 3413 full-logo variants.

1. Separate the variants by their current Printful artwork file before opening **Change print file**. Printful rejects a mixed selection whose variants do not share the same print file.
2. Record the artwork size and position, then move the whole layer by the required amount without touching its resize handles. For the 3413 full logo, the layer remained 12.00 × 10.23 inches and moved upward approximately 0.75 inch.
3. Repeat the identical movement for every artwork-color group. The 3413 product required a 24-variant signature-brown group and a 72-variant warm-cream group.
4. Regenerate mockups with the same style for each group. For this front-only product, choose Basic mockups → Ghost, leave Front selected, and clear Back, Left, and Right.
5. Wait for Printful's **Print file changes queued** confirmation, then verify all variants through the Sync API and visually inspect at least one storefront variant from each artwork group.
