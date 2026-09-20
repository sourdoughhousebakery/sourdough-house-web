# Logo hoodie color variations — September 9, 2026

Store: My Store / Shopify `ku4tbz-mj`; Printful store `18715291`.

## Batch status

| Source template | Template ID | Shopify product | Printful sync product | Status |
|---|---:|---:|---:|---|
| SDH Crop Hoodie Front Logo | 107286105 | 7544749981781 | 469508925 | Published front only, 15 variants / 3 images |
| SDH Crop Hoodie Logo | 107286042 | 7544685690965 | 469479584 | Published, 15 variants / 6 images |
| SBH Front Logo Hoodie | 107285960 | 7544691327061 | 469482448 | Published, 55 variants / 11 images |
| SBH Logo Hoodie | 107285900 | 7544693981269 | 469483364 | Published, 55 variants / 22 images |

User explicitly confirmed “Front logo only.” Removed the back layer from template 107286105, preserved its original front artwork and geometry, omitted unavailable Peach, saved and published. All four hoodie listings are complete.

## Color rules

Bella+Canvas 7502 cropped hoodie, DTG: Black, Military Green, Storm use warm cream. Peach is discontinued in the published-product editor; it blocks Change print file. Catalog variant 9641 (Peach XL) was also out of stock, with only a UK supplier-out-of-stock region. Removed that newly published unavailable variant and its two gallery images from product 7544685690965. The front-only crop template was saved with Black, Military Green and Storm; Peach was omitted before publishing.

Bella+Canvas 3719 regular hoodies, DTFlex / DTFILM: Black, Black Heather, Maroon, Forest, Heather Navy, Team Purple, Heather Forest, True Royal use warm cream. Athletic Heather, Lilac, White use signature brown. All 55 selected catalog combinations were in stock at inspection. Retain S, M, L, XL, 2XL.

## Artwork and geometry

| Approved asset | Printful file ID |
|---|---:|
| Full bakery logo, warm cream, alignment-v2 | 1063172331 |
| Full bakery logo, signature brown, alignment-v2 | 1063172327 |
| Dragonfly, warm cream | 1062542074 |
| Dragonfly, signature brown | 1062542078 |

Crop front-only: original cream full logo, 8.50 × 7.24 in, 530 DPI. Back, sleeves and wrists empty. Published Black/S design reopened and confirmed the original front size and empty back. All 15 variants use approved file 1063172331 as the sole production file (API type `default`, the DTG front), plus preview. Retail $44 S–XL / $47 2XL. Shopify handle `crop-hoodie-1`.

Crop front/back: original small cream dragonfly on wearer-left chest, 3.55 × 2.10 in; original cream full logo back, 10.00 × 8.52 in. No production artwork changes were needed after unavailable Peach was removed. Retail $52–$54.50.

Regular front-only: original cream full logo 10.48 × 8.90 in. Brown replacement uses the same 10.48-inch width, proportional height 8.93 inches, and same visible center. Original cream source was slightly shorter in the editor; do not claim exactly identical height. Saved brown layer reopened and checked on Athletic Heather, White and Lilac. Back, large back, sleeves and label remain empty. Retail $43–$45.50.

Regular front/back: original BROWN dragonfly front 4.52 × 2.66 in, wearer-left chest; original brown full logo large back 11.76 × 10.02 in. Replaced only the eight dark colors with cream. Cream dragonfly is 4.52 × 2.67 in after proportional resizing; aligned over the original before deleting the old layer. Cream large-back logo remains 11.76 × 10.02 in and centered. Saved designs reopened, each with one correct layer per printed placement. Retail $51–$53.50.

## Mockups and verification

All galleries use Ghost printed views: front only for front-logo style; front and back for front/back styles. Initial Publish wizard title edits did not persist; corrected descriptive titles through Shopify. Production updates used browser grouped Change print file to preserve editable positioning. Disabled Publish mockups during those edits because the old mockup screen rendered blank previews. Generated corrected views through the documented Printful mockup API, uploaded permanent Shopify copies, selectively replaced stale images, and associated every changed size with the correct front image. Kept the black front image first.

Catalog print areas were checked across every selected physical size: 7502 front/back use printfile 57 (10 × 10 in); 3719 front_dtf uses 511 (15 × 12 in), back_large_dtf uses 333 (15 × 18 in). Mockup geometry is recorded in output request files. Regular dragonfly offset was measured from the editor canvas (approximately left 9.31 in, top 1.50 in), and back is centered. No sync position fields were invented.

All 140 retained variants passed saved Printful checks for expected files, sync, file status, original catalog IDs, retail prices, and options. Shopify checks passed correct variant front images, availability, Printful inventory location and Printful Hoodies shipping profile. All four products are Active and published to Online Store. Printful supplied its own inventory; no inventory quantities were fabricated or written.

Full evidence and resumable progress: `output/printful-logo-hoodies/`. This includes initial/final Printful mappings, catalog and print areas, mockup requests/results, media manifest, uploaded Shopify media IDs, Shopify audits and `progress.json`.

Storefront cart tests passed: front/back White 2XL $53.50 and Black S $51; front-logo White S $43; crop Storm S $52. Variant IDs, images, quantities and prices matched. All four temporary test lines were removed. No checkout or order was placed.

Front-only crop completion: Publish wizard successfully generated exactly three Ghost front images (Black primary, Military Green, Storm); no API mockup replacement was needed. All 15 Shopify variants have the correct color image, Printful location 75165401173 and Hoodies shipping profile, and are available. Storefront color switching was visually checked, including cream contrast on Military Green and Storm. Storm 2XL variant 42971976794197 added at $47, quantity 1, then removed; the cart returned to its original empty state. No checkout or order was placed. Evidence: `469508925-final.json` and `shopify-7544749981781-audit.json`.
