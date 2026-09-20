# Printful launch readiness - September 10, 2026

## Verified in this check

- Selected Shopify-linked Printful store: 18715291.
- Complete Printful Ecommerce Sync pagination: 31 products and 1,254 variants.
- All 1,254 variants are synced, none ignored, each has a catalog variant and at least one non-preview production file.
- Every production file reports `ok`; every variant reports active availability.
- External variant IDs exactly match the 1,254 variants in the Shopify price-update readback. No missing or extra IDs.
- This establishes mapping/file readiness, not a physical product inspection or proof of checkout-to-production processing.
- Earlier Shopify inspection found all products associated with Printful shipping profiles and rates for the active USA/Canada market. Destination checkout totals remain untested.

Evidence: output/printful-readiness-2026-09-10/sync-readback.json and sync-summary.json. Shopify comparison: output/pricing-2026-09-10/shopify-after.json.

## Owner's decision

Owner approval for the first real orders, before Printful charges the bakery and starts production. User selected this explicitly. Subsequently opened the internal browser, which was already signed in as Mindy. Changed `Automatically confirm orders to be fulfilled` to `Manually confirm imported orders`, saved and verified the checked radio after a reload. Existing Printful order queue was empty before this change.

Inspect both Shopify fulfillment-request/import behavior and Printful's separate automatic-confirmation setting. A manual Shopify setting does not alone prove Printful will wait. Aim for a clear, tested review procedure and record the exact action the owner must take on each order.

## Remaining checks

1. Internal-browser Printful access is working. The separate Brave session was signed out; it was not required. Internal browser is left on Billing methods.
2. Import/confirmation settings verified: automatic import of synced products is ON; manual confirmation is now selected and persisted. Expected workflow is automatic draft import, then owner approval in Printful. Verify this with a controlled order before relying on it. Store selector still calls the connected Shopify store `My Store`; General shows ku4tbz-mj.myshopify.com and store links identify 18715291. A second Printful store named Sourdough House Bakery exists; do not confuse it with this Shopify connection.
3. Billing methods inspected: NO account or store billing method has been added; store currency is USD. Owner must add a valid owner-controlled funding method, complete billing information and keep sufficient available funds. Owner completes any missing payment details; no paid order or funding transaction is authorized by this audit.
4. Relevant email alerts are ON: payment errors, print-file/active-order errors, unfinished orders, confirmations/status/approval, shipment problems, sync and stock/discontinuation issues. Daily digest is OFF. My Account screenshot confirms admin@sourdoughhousebakery.com, connected through Google. Owner must monitor that inbox; actual alert delivery remains untested. Added shopsupport@sourdoughhousebakery.com to packing-slip customer support, keeping `Show this email on the order tracking page` checked; after reload a screenshot confirms the packing-slip email persisted. Partner/backup facilities may omit customized slips.
5. Shipping preferences inspected: Printful shipping profiles ON, free shipping OFF, live shipping rates OFF (turning on live rates would remove existing profiles, so preserved). Automatic stock updates ON. Store selling region is USA, which is a Printful availability preference, not Shopify's customer country restriction. Backup facilities and product alternatives are ON and unchanged; review substitution behavior before approving first orders. Holiday surcharge passthrough is OFF; dashboard shows a $0.40 US surcharge October 15-January 17, to consider in final margins. Legal/tax info and return routing still need owner review.
6. Run a controlled end-to-end order test after Shopify can accept it. Verify import, unpaid/unconfirmed hold before approval, correct items/address/cost, tracking and notifications. Separately authorize any paid sample or production.
7. Update the owner's guide with the verified workflow and practice on the owner's own device.

## References

- [Printful order processing](https://help.printful.com/hc/en-us/articles/6148086204316-How-do-I-manage-order-processing-and-fulfillment-in-Shopify)
- [Import and confirmation settings](https://help.printful.com/hc/en-us/articles/360014066019-Why-are-my-Shopify-orders-not-being-imported-to-Printful)
- [Separate customer and supplier payments](https://help.printful.com/hc/en-us/articles/360014065439-How-do-I-accept-payments-for-my-orders)
