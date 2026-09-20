# Shopify before-launch work — September 10, 2026

## Completed and verified

- Renamed Shopify from “My Store” to **Sourdough House Bakery**. Verified in admin, API and storefront browser titles.
- Configured the only active market as **United States and Canada**. No other active markets exist.
- Saved **Return/refund, Shipping, Contact information and Terms of service** policies in Shopify. API connector lacked write_legal_policies; used the signed-in admin editor and verified saved content through the API.
- Applied the selected made-to-order return policy: no voluntary size/color/change-of-mind returns; approved defects and fulfillment errors corrected; statutory rights preserved. Policies cover missing parcels, cancellation limits, original-payment refunds, Canada customs and separate bakery orders.
- Created **Merchandise help** at /pages/merchandise-help, covering guest accounts, order tracking, sizing/care, separate shipments, support and the separation between merchandise and baked-goods orders.
- Used **shopsupport@sourdoughhousebakery.com** in merchandise help, new policies and the draft theme footer. The user subsequently confirmed this address is working; Shopify sender was updated and verified after reload.
- Expanded all six new drinkware descriptions with actual Printful materials, capacity, dimensions and product-specific care. For the CamelBak printed finish, handwashing is explicitly a recommendation; no unsupported dishwasher or hot-drink claim was added.
- Draft theme: visible production timing/returns/help above Add to cart; homepage Drinkware card; descriptive homepage image alternative text; merchandise support/help and policy links in footer.
- Corrected Drinkware's collection rule: include either sdh-drinkware or sdh-mugs. It now contains all **10 drinkware products**, rather than only the six new additions.
- All four edited theme files passed the Shopify Liquid skill validator. Installed its declared validator dependencies in an isolated temporary directory because the bundled skill lacked them.
- Read back and compared all four remote theme files: Liquid exact match, JSON semantic match.
- Verified all six descriptions after Shopify HTML whitespace normalization. Prices were initially preserved; the subsequent pricing update below now supersedes the original prices.
- Inspected the homepage and product page at desktop width, plus the help page, product purchase guidance and refund policy at 390px phone width. Phone product/help/refund pages have document width 390px with no horizontal overflow. Reset the viewport afterward.
- Rendered Privacy policy contains no unexpanded Liquid placeholders. Its contact paragraph still uses admin@sourdoughhousebakery.com and says “please call or email” with no phone shown.

## Shipping findings

All 31 products are associated with Printful shipping profiles. All product-bearing profiles have the Printful fulfillment location and active US and Canadian rates. The general profile has no products. Complete pagination was checked.

Examples of configured rates in USD (settings, not completed checkout quotes):

| Merchandise | USA | Canada |
|---|---:|---:|
| Shirt | $4.95 | $8.59 |
| 11 oz mug | $6.69 | $8.09 |
| Magnet | $4.69 | $8.29 |
| Hoodie | $8.79 | $10.59 |
| Flip-straw bottle | $9.29 | $13.49 |

Printful's shipping profiles retain their broader country zones, but the active selling market is limited to US/Canada. This preserves app-managed rates. A real destination checkout test must verify country restrictions and combined rates once checkout can accept orders. Do not assume a mixed cart costs the largest single-item rate.

## Remaining before public launch

1. **Support email — configured:** user confirmed shopsupport@sourdoughhousebakery.com is working. Saved it as Shopify’s customer sender and verified persistence after reloading Notifications. Shopify displayed no verification or authentication notice. Actual Shopify notification delivery remains part of the end-to-end test.
2. **Business/payment setup:** choose a Shopify plan and complete Shopify Payments onboarding with the seller's actual business, identity and payout details. Store still reports trial; the earlier checkout test could not accept orders. Confirm tax collection settings for the actual business and its registrations.
3. **Printful billing and approval:** user selected owner approval for initial real orders, before Printful charges and produces them. Internal-browser access is working. Saved and reloaded manual confirmation, with automatic draft import enabled. Fresh API check passed for all 31 products / 1,254 variants. Billing has no saved method; operational email alerts are enabled for the account at admin@sourdoughhousebakery.com. Owner adds billing and verifies delivery of alerts, then conduct a controlled test. See docs/printful-launch-readiness-2026-09-10.md. No order or charge was created in this work.
4. **End-to-end checkout:** test a shirt, mug, magnet and mixed cart to representative US and Canadian addresses; check taxes, shipping, currency, receipts, support replies, tracking, cancellation/refund handling and Printful import. Use a deliberately controlled test, then separately authorize a physical sample order.
5. **Domain:** shop.sourdoughhousebakery.com still has no CNAME. In GoDaddy add CNAME host shop → shops.myshopify.com, then connect that exact subdomain in Shopify and verify HTTPS. Preserve root/www and email DNS. GoDaddy tab was at sign-in, so no DNS record was changed.
6. **Final business/contact review:** confirm accurate seller contact details; automated Privacy policy currently has no phone and uses the admin address. The new terms are concise store-specific operating terms, not a jurisdiction-by-jurisdiction legal review.
7. **Pricing — applied:** saved the proposed whole-dollar retail tiers across all 31 products and 1,254 variants, with complete readback verification. See docs/shopify-applied-prices-2026-09-10.md and output/pricing-2026-09-10/applied-price-list.csv. Final all-in margin review remains dependent on decorated Printful costs, payment fees and shipping.
8. **Launch:** publish the approved branded draft, update the bakery's Shop links to the verified subdomain, and remove password protection only after operational testing.

## Preview and supporting files

- Owner operating guide: [editable guide](shopify-owner-guide.md) and [printable PDF](../output/pdf/sourdough-house-owner-guide.pdf). Prepared September 10 with daily checks, order troubleshooting, customer replies and a handoff exercise. Owner training, access verification and final production-mode selection remain incomplete. Matt handles setup; ongoing customer support belongs to the owner, with separate arrangements for future custom website maintenance.
- [Updated draft storefront](https://jfm9jnsx5jqq2946-66583855189.shopifypreview.com/)
- [Merchandise help preview](https://jfm9jnsx5jqq2946-66583855189.shopifypreview.com/pages/merchandise-help)
- Earlier full audit, pricing and operations guide: docs/shopify-launch-review-2026-09-10.md.
- Backups, saved content and verification: output/before-launch-2026-09-10/.
- Theme source: /private/tmp/sdh-shopify-theme/shopify/theme/.
- Draft theme ID 139515527253 remains **UNPUBLISHED**. Store remains password protected. Main theme, artwork and Printful variant mappings were not changed. Retail prices were subsequently updated as documented above.

## Sources used for customer copy

- [Printful fulfillment timing](https://help.printful.com/hc/en-us/articles/360014007980-How-long-does-fulfillment-take)
- [Printful returns/refunds](https://help.printful.com/hc/en-us/articles/360014006840-What-is-Printful-s-return-and-refund-policy)
- [Printful product care](https://help.printful.com/hc/en-us/articles/360014066579-How-do-I-take-care-of-my-products)
- Live Printful catalog API for products 742, 837, 848, 935, 382 and 788.
- [Canada Office of Consumer Affairs: refunds and exchanges](https://ised-isde.canada.ca/site/office-consumer-affairs/en/business-practices-and-consumer-concerns/refund-and-exchange)
- [Shopify subdomain connection](https://help.shopify.com/en/manual/domains/add-a-domain/connecting-domains/connect-subdomain)

## Drinkware typography correction

Replaced the oversized Details/Care H2 headings in all six new drinkware descriptions with compact bold body labels. Verified the straw-lid bottle preview renders the labels in DM Sans, 15px, weight 700. Product copy, prices and theme files unchanged by this correction. Before/after records are saved in output/before-launch-2026-09-10/drinkware-typography-*.json.

## Confirmed support email

User confirmed the support address. Shopify Notifications sender is now shopsupport@sourdoughhousebakery.com, saved and verified after reload. No verification/authentication warning was displayed. Account login and internal store email remain unchanged. No test email was sent in this step.
