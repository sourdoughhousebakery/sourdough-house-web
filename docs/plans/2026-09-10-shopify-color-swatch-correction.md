# Shopify Color Swatch Correction Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make every Shopify Color selector accurately represent its named fabric color while preserving all product and variant records.

**Architecture:** Shopify Color category entries are shared metadata. Correct each entry at its source, then connect every existing Color option to the appropriate entry and verify the customer-facing theme response. No repository production code changes are required.

**Tech Stack:** Shopify Admin, Shopify product taxonomy Color entries, Shopify theme product pages, Computer Use browser automation.

---

### Task 1: Establish the full color-variant audit set

**Files:**
- Reference: `docs/printful-cuffed-beanie-color-pairings.md`
- Reference: `docs/printful-dragonfly-beanie-color-pairings.md`
- Create: `docs/verification/2026-09-10-shopify-color-swatch-audit.md`

**Step 1: Record the expected color entries**

Create an audit table listing each product with a Color option, every available color value, and its expected visual swatch: Black, Brown, Navy, Dark Grey, Royal, Red, Olive, Spruce, Heather Grey, Gold, Baby Pink, and White.

**Step 2: Inspect the current Shopify Admin color entries**

Open Shopify Admin for `ku4tbz-mj`, inspect each Color option's linked category value, and record its current swatch. Do not save changes during this step.

**Step 3: Verify the audit identifies the defect**

Compare the recorded swatch with its selected label and product image. Expected result: entries such as Dark Grey show the incorrect cream swatch before correction.

### Task 2: Correct shared Color entries

**Files:**
- Modify: Shopify Admin shared Color entries only
- Update: `docs/verification/2026-09-10-shopify-color-swatch-audit.md`

**Step 1: Update one incorrect shared entry**

Set Dark Grey to a neutral charcoal-grey swatch, then save only that Color entry.

**Step 2: Verify the entry change**

Reload the product option editor and confirm Dark Grey now previews as charcoal grey; confirm its variant values and associated media count are unchanged.

**Step 3: Correct remaining entries**

Set each remaining shared entry to its true fabric color: Black, Brown, Navy, Royal, Red, Olive, Spruce, Heather Grey, Gold, Baby Pink, and White. Save each entry without altering names, variants, or media.

**Step 4: Verify shared entries**

Reopen every edited entry. Expected result: all color labels display an appropriate solid-color swatch.

### Task 3: Audit every customer-facing Color selector

**Files:**
- Update: `docs/verification/2026-09-10-shopify-color-swatch-audit.md`

**Step 1: Inspect all catalog products that have a Color option**

Use Shopify Admin product filtering to find each product with Color variants. For each product, inspect all selector values in the Online Store preview.

**Step 2: Check swatch-to-label agreement**

Select every Color value and record that the label and visible square agree. Check that switching the value retains the existing variant-linked image.

**Step 3: Check variant integrity**

For each product, confirm the option values, number of variants, prices, inventory state, and media associations did not change.

**Step 4: Capture final evidence**

Record the product count, corrected color entries, any exceptions, and the final screenshots/URLs in the audit document.

### Task 4: Final verification and commit

**Files:**
- Modify: `docs/verification/2026-09-10-shopify-color-swatch-audit.md`

**Step 1: Revisit the reported beanie pages**

Open both cuffed-beanie product pages, select Dark Grey, and confirm its square is charcoal grey while the correct Dark Grey image remains selected.

**Step 2: Review scope**

Confirm no repo files besides the audit document changed and no Shopify product media, pricing, inventory, or variant structure changed.

**Step 3: Commit evidence**

```bash
git add docs/verification/2026-09-10-shopify-color-swatch-audit.md
git commit -m "docs: verify Shopify color swatch corrections"
```
