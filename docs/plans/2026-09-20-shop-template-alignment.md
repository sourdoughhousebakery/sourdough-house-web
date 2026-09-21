# Shop Template Alignment Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make collection and product templates use the same 1,152 px centered desktop content width as the bakery homepage and header.

**Architecture:** Override Horizon's existing `--narrow-page-width` token through the supported theme-wide Custom CSS setting instead of patching individual template sections. The native collection grid's existing `auto-fill` rule will reduce the grid from five columns to four at the new width.

**Tech Stack:** Shopify Horizon theme, theme-wide Custom CSS, CSS custom properties, Shopify theme editor, browser DOM measurements

---

### Task 1: Capture the regression

**Files:**
- Test: one-off live DOM assertions against theme `139515527253`

**Step 1: Run a failing computed-style assertion**

Read `--narrow-page-width` from the computed body styles on the active storefront.

Expected: FAIL because the current value is `90rem`, not `72rem`.

**Step 2: Record current desktop measurements**

At the current desktop viewport, measure the header, collection grid, product component, and recommendation list bounding boxes.

Expected: header width 1,152 px; native template content width 1,440 px.

### Task 2: Apply the shared width token

**Files:**
- Modify in Shopify theme `139515527253`: Theme settings > Custom CSS

**Step 1: Open the current Custom CSS setting**

Use the authenticated `sourdoughhousebakery.com` Chrome profile and verify the editor targets `Sourdough House - design preview` (`139515527253`).

**Step 2: Make the minimal CSS change**

Preserve the existing `.card` rule and append:

```css
body.sdh-store {
  --narrow-page-width: 72rem;
}
```

Do not change template JSON, section settings, or unrelated styles.

**Step 3: Save the theme setting**

Save the Custom CSS setting and wait for Shopify's saved confirmation.

### Task 3: Verify the aligned templates

**Files:**
- Verify live: computed storefront styles
- Verify pages: `/collections/apparel` and `/products/unisex-hoodie`

**Step 1: Run the computed-style assertion again**

Expected: PASS with the 72rem bakery-scoped narrow-width token present.

**Step 2: Verify collection alignment**

Measure the header and `.product-grid` bounding boxes at desktop width.

Expected: matching 1,152 px width and matching horizontal edges; four product columns.

**Step 3: Verify product alignment**

Measure the header, `.product-information__grid`, and recommendation `.resource-list` bounding boxes.

Expected: matching 1,152 px width and matching horizontal edges.

**Step 4: Verify responsive safety**

Check collection and product pages at mobile width.

Expected: no horizontal overflow; existing mobile layouts remain intact.

**Step 5: Record the change**

Update the current Shopify layout ledger with the exact theme ID, identity, changed file, measurements, and verification results.
