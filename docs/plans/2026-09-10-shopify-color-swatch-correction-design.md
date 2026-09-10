# Shopify color-swatch correction design

## Goal

Correct every customer-facing color swatch so it represents the selected product variant's actual fabric color, without changing product images, variant combinations, inventory, pricing, publication status, or fulfillment configuration.

## Scope

Use Shopify's reusable Color category entries as the single source of truth for all products with a Color variant option. Audit and correct these entries: Black, Brown, Navy, Dark Grey, Royal, Red, Olive, Spruce, Heather Grey, Gold, Baby Pink, and White.

## Approach

1. Inspect the shared Color entries and assign each its correct solid-color swatch.
2. Ensure every product Color option uses the matching shared Color entry.
3. Inspect every product page with color variants to confirm its selected label, color square, and associated image agree.

## Safeguards

Only the visual color metadata and links to those entries may change. Existing product images and their variant associations stay intact. No product option values or variant records will be added, removed, renamed, or reordered.

## Verification

For every product with a Color option, select each value and check that its visible swatch reflects the named color. Confirm images continue changing with the selected variant as before.
