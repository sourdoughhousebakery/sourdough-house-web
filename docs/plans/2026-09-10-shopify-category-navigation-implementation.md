# Shopify Category Navigation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the category pill strip with a scalable Shopify-menu-driven category explorer on product and collection pages.

**Architecture:** Create one Shopify Navigation menu containing the current collection hierarchy. Update the existing `sdh-browse` Liquid section to render that menu through a native details/summary disclosure, with the current collection highlighted and the existing collection-list setting retained as a fallback.

**Tech Stack:** Shopify Admin GraphQL, Shopify Navigation menus, Online Store 2.0 Liquid sections, CSS, Shopify theme-check, browser verification.

---

### Task 1: Create the Shopify category menu

**Files:**
- No repository files

**Step 1: Discover the menu mutation**

Inspect the Shopify Admin GraphQL `Mutation` type and the relevant menu input types.

**Step 2: Validate the menu operation**

Validate a `menuCreate` operation for a `shop-categories` menu containing Shop all, Apparel with Shirts and Hoodies, Mugs, Accessories, and Baking Sayings.

**Step 3: Create or reuse the menu**

Query existing menus by handle first. Create the menu only if it does not already exist; otherwise update the matching menu without creating a duplicate.

Expected: one menu with the approved hierarchy and valid collection URLs.

### Task 2: Build the scalable category explorer

**Files:**
- Modify: `/private/tmp/sdh-shopify-theme/shopify/theme/sections/sdh-browse.liquid`

**Step 1: Add the Shopify menu setting**

Add a `link_list` setting named `menu` while retaining the existing `collection_list` fallback.

**Step 2: Render the compact trigger**

Use native `<details>` and `<summary>` markup for a one-row `Shop categories` trigger and an optional `Viewing: <collection>` label.

**Step 3: Render nested menu links**

Render top-level links and one nested level. Mark the current collection link with `aria-current="page"`.

**Step 4: Keep the fallback**

When no menu is assigned, render Shop all and the existing collection-list links in the disclosure panel.

### Task 3: Style the navigation component

**Files:**
- Modify: `/private/tmp/sdh-shopify-theme/shopify/theme/assets/sdh-brand.css`

**Step 1: Replace obsolete pill styles**

Remove the always-visible category row treatment and add compact trigger, panel, grouped-link, active-state, and focus styles.

**Step 2: Add responsive behavior**

Use a floating panel on desktop and a full-width panel on mobile. Keep all links at least 44px tall and prevent horizontal overflow.

**Step 3: Support motion preferences**

Use short opacity/translate transitions that respect the theme's existing reduced-motion rule.

### Task 4: Connect the menu to templates

**Files:**
- Modify: `/private/tmp/sdh-shopify-theme/shopify/theme/templates/product.json`
- Modify: `/private/tmp/sdh-shopify-theme/shopify/theme/templates/collection.json`

**Step 1: Set the menu handle**

Assign `shop-categories` to the `sdh_browse` section settings in both templates.

**Step 2: Validate JSON**

Run: `python3 -m json.tool shopify/theme/templates/product.json >/dev/null && python3 -m json.tool shopify/theme/templates/collection.json >/dev/null`

Expected: exit code 0.

### Task 5: Validate and upload the draft theme

**Files:**
- Upload: `sections/sdh-browse.liquid`
- Upload: `assets/sdh-brand.css`
- Upload: `templates/product.json`
- Upload: `templates/collection.json`

**Step 1: Run local checks**

Run Shopify theme-check with error-level failure and the schema ID dedupe validator for the updated section.

Expected: zero theme errors and no duplicate setting IDs.

**Step 2: Validate the theme file mutation**

Validate `themeFilesUpsert` against the Admin GraphQL schema.

**Step 3: Upload only to the unpublished theme**

Target `gid://shopify/OnlineStoreTheme/139515527253` and confirm all four files are upserted without user errors.

### Task 6: Verify product and collection pages

**Files:**
- Test: unpublished Shopify preview

**Step 1: Test a product page**

Confirm the closed component is one compact row, the nested menu opens, all links work, and the product panel remains the focus.

**Step 2: Test a collection page**

Confirm the `Viewing` label and active collection state are correct.

**Step 3: Test mobile**

At 375px, confirm full-width menu behavior, 44px touch targets, nested links, and no horizontal overflow.

**Step 4: Return preview links**

Provide direct product and collection preview links and state that the design remains unpublished.
