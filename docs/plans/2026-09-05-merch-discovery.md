# Merch tab — discovery and proposed direction

Status: research completed; proposed design, not an approved implementation plan. No website code, Printful products, publishing, or checkout settings changed.

## Current evidence

- The Next.js site has Menu, Story, Order, and Contact navigation. Bakery ordering uses Hotplate. No merch route, Printful adapter, or payment integration exists in the inspected application code.
- The authenticated Printful Product templates page is accessible. Refreshing it showed the current LVL 3 apparel titles, including the new illustrated tees and BELLA+CANVAS hoodie.
- The latest local audit, `.qa/printful/illustrated-expansion-2026-09-05/final-live-audit.json`, records 58 templates: 40 tees, three hoodies, two crewnecks, two totes, two aprons, one hand towel, and eight mug templates. These are template counts, not distinct customer-facing products. This session did not independently re-audit all 58 saved configurations.
- Drinkware in that inventory consists of classic white mugs, color accent mugs, enamel camp mugs, and travel mugs. No separate drinking-glass template was identified.
- The earlier review images are browser screenshots, not clean storefront product photography. The latest verification record reports unavailable thumbnails for 40 tees and unresolved Printful mockup generation. Preserve this limitation when preparing the preview.
- Older collection notes describe different hoodie and crewneck blanks. Use the latest saved product configuration when importing, not those superseded notes.

## Recommended first phase: local merch preview

Add a Merch navigation item and `/merch` route in the existing bakery visual style. Build the catalog from the bakery's saved products, with a deliberate draft-to-visible review step. Keep the initial preview local until the collection and imagery are approved.

Use Printful catalog category IDs and ancestry as source metadata, then present only populated categories. Proposed compact customer filters are All, T-shirts, Hoodies & sweatshirts, Drinkware, Tote bags, Aprons, and Towels. These are proposed display labels, not a claim that each exactly matches Printful's current API taxonomy. Printful places drinkware, aprons, and towels under Home & living; avoid carrying over unrelated catalog branches.

Use design collections as a separate filter: Bakery Logo, Baking Sayings, and Illustrated. A saying available as both typography and illustration remains a distinct design. Group light/dark templates for the same design and blank into one product with valid color choices, retaining the correct template and artwork mapping. Logo colors may remain options where the saved configuration supports them. Do not offer arbitrary combinations of garment, ink, size, or capacity.

Cards show a verified product mockup, customer-friendly title, product type, and available color choices. A product detail view shows additional mockups and the configured options. Drafts have a clear preview state and no working purchase action. Omit unset retail prices; Printful manufacturing costs must not appear as retail prices.

## Import and data boundary

Printful documents read endpoints for product templates and catalog categories. A future server-side import can read all template pages, resolve catalog products/categories, and save a normalized local catalog snapshot. Verify API access and exact response fields before implementation; this session used the authenticated UI and existing audit files, not an authenticated Printful API request.

Keep template IDs, catalog IDs, source categories, configured options, image review state, and visibility separate from customer titles and descriptions. Retain the last successful snapshot if refresh fails. Keep credentials on the server. A saved template is design input, not a purchasable listing: retail prices, descriptions, saleable variants, and checkout mapping need a separate step. Published store products must become the sales source after launch because template edits do not synchronize to existing published listings.

## Sales integration options after the preview

1. **Website catalog plus Printful Quick Store:** the simplest candidate for an initial US-only launch. Keep browsing on the bakery website and link to the published store for purchasing. Confirm available product links and account eligibility before choosing this route. Quick Stores uses a Printful-hosted URL and currently requires US merchants and US delivery addresses.
2. **Website catalog plus an established commerce platform connected to Printful:** more configuration and platform cost, but established checkout and order management. Evaluate if the business needs broader commerce capabilities.
3. **Custom checkout plus Printful fulfillment API:** maximum control, but requires payment verification, valid variant mapping, shipping calculation, order submission/retry protection, status updates, and failed-order handling. This is a larger project than a merch tab.

Recommendation: approve and build the local catalog preview first. Choose the sales route before enabling purchases. Keep merch shipping information distinct from bakery pickup instructions.

## Preview acceptance checks

- Desktop and mobile navigation reach Merch.
- Only categories represented by visible products appear.
- Light/dark duplicates group correctly without merging different designs or blanks.
- Product options reflect verified saved configurations.
- Unusable images cannot masquerade as approved mockups.
- Draft products cannot initiate checkout, and unset retail prices remain unset.
- A failed import preserves the last working catalog.

## Sources

- [Printful API documentation: templates and categories](https://developers.printful.com/docs/)
- [What a product template contains; publishing and synchronization behavior](https://help.printful.com/hc/en-us/articles/360014010300-What-s-a-product-template-and-how-does-it-work)
- [Printful Home & living categories](https://www.printful.com/custom/home-living/all)
- [Selling with Printful](https://help.printful.com/hc/en-us/articles/360019389419-Do-I-need-to-create-my-own-store-to-sell-with-Printful)
- [Quick Stores regional availability](https://help.printful.com/hc/en-us/articles/15045280299548-Is-Quick-Stores-available-in-my-area)
- [Quick Stores versus platform integrations](https://help.printful.com/hc/en-us/articles/15045161765916-How-is-Quick-Stores-different-from-ecommerce-platform-integrations)
