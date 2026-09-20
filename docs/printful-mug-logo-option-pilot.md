# Mug logo color variant pilot

Verified September 9, 2026. User authorized customer-selectable logo colors within one Shopify mug listing, then requested precise alignment and a reusable normalized palette covering every logo color.

## Completed normalization and five-color expansion

This section supersedes the original two-color artwork notes below. The original manual overlay still had a slight visible shift, which the user correctly identified.

Eight reusable masters are in `public/brand/printful/full-logo-normalized-all-colors-v3/`, with a ZIP alongside that folder. Brown, Black, White, Warm Cream, Sage, Rust, Honey Gold, and Blue all have identical 4590 × 3926 canvases, identical alpha, and 45-pixel transparent margins. All eight were uploaded to Printful. Original source files were preserved. The user explicitly approved deterministic scripting; regeneration is in `scripts/prepare-enamel-mug-palette.py`.

Printful master file IDs verified in the library: Blue `1064719000`, Brown `1064718998`, Black `1064718997`, Rust `1064718996`, Honey Gold `1064718994`, Sage `1064718992`, White `1064718990`, Warm Cream `1064718988`.

Eight separate enamel wraps are in `public/brand/printful/enamel-mug-aligned-v2/` and uploaded to Printful. Each is 4800 × 1440 at 600 DPI, used at exactly 8 × 2.4 inches. Visible art is 1224 × 1043 pixels at offset (3288, 271). Same alpha and fixed placement in every file; no dragging or per-color sizing. One layer only, opposite side blank, duplicate-on-both-sides off.

| Color | Shopify variant | SKU | Printful file ID | Final handle-right mockup suffix |
| --- | --- | --- | --- | --- |
| Brown | 42971129217109 | 4006603_11189 | 1064718810 | 6aa1b15c0f432 |
| Blue | 42971129249877 | 4006603_11190 | 1064718814 | 6aa1b1a2dae73 |
| Black | 42971253932117 | 1959453 | 1064718805 | 6aa1b2e543f52 |
| Sage | 42971253964885 | 9209913 | 1064718804 | 6aa1b317e7157 |
| Rust | 42971253997653 | 9118675 | 1064718813 | 6aa1b350c55ec |

Five colors are enabled on this white mug for contrast. White, Warm Cream, and Honey Gold remain available as reusable masters for suitable future products.

Printful verified **5 Synced**, no unsynced or disabled variants. All five use the same physical white 12 oz enamel mug, $16.50 retail / $12.67 base. Saved Black, Sage, and Rust designs were reopened and verified as one correct 8 × 2.4-inch, 600 DPI layer. Brown was also verified through the source design used for cloning.

Mockup regeneration replaced the original gallery images and pushed three angles per color. Removed ten blank/partial angles, leaving five full-logo handle-right images, ordered Brown, Blue, Black, Sage, Rust, with matching variant associations. All five were visually checked in the customer selector. Brown/Blue rendered 832-pixel images additionally had best color-isolated artwork cross-correlation at exactly zero horizontal and vertical shift (0.9499 correlation; color and compression differ).

New variants initially retained Shopify's **Shop location** while Printful's 9999 inventory was unselected for fulfillment. In each new variant's **Inventory → Edit locations**, unchecked Shop location and checked App Printful, then saved. No stock quantities were fabricated or edited. All five now show 9999 available from Printful.

Customer-preview add-to-cart passed for all five distinct variant IDs, quantity one each, $16.50 each, total $82.50. Removed only the five test items and confirmed **Your cart is empty**. No checkout or order submitted. Physical production was not tested.

## Original two-color pilot history

## Published product

- Shopify product: `7544230182997`, handle `enamel-mug`.
- Title: Sourdough House Bakery — Enamel Camp Mug.
- Printful store: `18715291`; sync product: `469337277`.
- Physical product for both choices: Mug | Glossy | Enamel | White w/Silver Rim, White, 12 oz (catalog variant `11189`).
- Retail: $16.50 for either logo color; Printful base cost $12.67.

| Logo color | Shopify variant | SKU | Print file |
| --- | --- | --- | --- |
| Brown | 42971129217109 | 4006603_11189 | 01-sourdough-house-logo-signature-brown-alignment-v2.png, 4500 × 3836, library ID 1063172327 |
| Blue | 42971129249877 | 4006603_11190 | 08-sourdough-house-logo-sky-blue-alignment-v2.png, 2400 × 2337, library ID 1062565446 |

The SKU suffix on Blue is Shopify-generated and does not identify its physical Printful catalog product. Both are explicitly mapped to the same white enamel mug.

## Artwork and images

One full-logo layer on the handle-right side, opposite side blank; duplicate-on-both-sides unchecked. Brown uses the trimmed approved file at 2.04 × 1.74 inches (2206 DPI). Blue uses the older padded file at 2.11 × 2.05 inches (1137 DPI). Visible artwork size and placement match. Blue was overlaid against Brown as a reference, then the Brown reference was deleted from the Blue design.

Two JPG gallery images remain, each showing the full logo with handle right. Brown is first/default. Brown image `enamel-mug-white-12-oz-right-6aa1abad3fdff`; Blue image `enamel-mug-white-12-oz-right-6aa1ab61e1081`. Each variant has its corresponding image assigned.

## Reusable procedure

1. Publish the base mug once.
2. In Shopify, add custom option **Logo color**, with Brown and Blue values. Save.
3. Refresh Printful's published product list. In this pilot, adding the first option replaced the original Default Title variant (`42971106115669`) with two new IDs. Both required manual synchronization. Never assume the original mapping survives this conversion.
4. Choose product for each unsynced variant and explicitly map the correct physical mug and artwork. The original enamel template was unavailable in the manual-sync template chooser, so Brown was configured from the catalog using the approved logo and original visible size/placement.
5. Once Brown is synced, use **Choose product → Published products → existing mug → Brown → Edit** to inherit its placement when configuring Blue. The editor heading names the source Brown variant; the yellow **You're syncing ... / Blue** banner identifies the target. Replace the reference artwork before Continue.
6. Manual sync restores fulfillment and inventory, but does not finish the gallery. Select each variant separately and use **Change print file → Proceed to mockups → Basic mockups → Grid view**, star the third/handle-right view, keep Publish mockups checked, and Continue.
7. This mockup flow pushed all three basic angles for each choice. After generation finished, remove blank/partial angles and superseded images in Shopify. Keep one full-logo image per choice, Brown first. Verify and manually assign any missing variant image.
8. Reopen each Printful variant to verify its saved layer. Confirm published product shows **2 Synced**, no unsynced or disabled variants.
9. Test storefront preview: Brown and Blue must switch images and add distinct variant IDs to cart at $16.50. Remove test cart items afterward.

## Verification

Passed image switching and add-to-cart tests in the Shopify storefront preview. Cart contained one Brown (`42971129217109`) and one Blue (`42971129249877`), each $16.50, total $33.00. Both test items were removed and empty cart confirmed. Printful showed 2 Synced, no unsynced or disabled variants. No checkout/order was submitted; physical production and shipping were not tested. Store remains password protected.

References: [Printful manual synchronization](https://help.printful.com/hc/en-us/articles/11818539480348-How-do-I-manually-sync-products-to-my-store), [Shopify variant editing](https://help.shopify.com/en/manual/products/variants/edit-variants).
