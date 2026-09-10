# Shopify Product Details Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the shared Shopify product details column with stronger hierarchy, compact option controls, prominent purchasing actions, and a collapsible description.

**Architecture:** Keep Shopify's native product-information, variant-picker, buy-buttons, and accordion blocks. Configure typography and block order in the JSON product template, then layer scoped Sourdough House styles over the existing markup so product selection and checkout behavior remain owned by Shopify.

**Tech Stack:** Shopify Online Store 2.0 JSON templates, Liquid theme blocks, CSS, Shopify Admin GraphQL theme file upload, Shopify theme-check, browser verification.

---

### Task 1: Configure the product information hierarchy

**Files:**
- Modify: `/private/tmp/sdh-shopify-theme/shopify/theme/templates/product.json`

**Step 1: Update the title and price blocks**

Set the title to the heading font with a custom responsive display size and set the price to the subheading font at 20–22px.

**Step 2: Tighten the product-details spacing**

Reduce the large gaps between controls while retaining a divider between identity and purchase choices.

**Step 3: Replace the expanded description**

Replace the raw description text block with a native accordion containing a `Product details` row whose text remains bound to `{{ closest.product.description }}`.

**Step 4: Validate JSON**

Run: `python3 -m json.tool shopify/theme/templates/product.json >/dev/null`

Expected: exit code 0.

### Task 2: Add scoped product-detail styling

**Files:**
- Modify: `/private/tmp/sdh-shopify-theme/shopify/theme/assets/sdh-brand.css`

**Step 1: Add the desktop details panel**

Style the product details container with a warm white surface, subtle espresso border, rounded corners, and soft shadow.

**Step 2: Strengthen the purchase hierarchy**

Make option legends, selected option values, price, size labels, and the primary Add to cart text visually distinct. Keep existing color swatches and Shopify checkout markup.

**Step 3: Style the Product details accordion**

Give the accordion a clear heading, divider, comfortable content spacing, and readable description typography.

**Step 4: Add responsive rules**

Reduce padding and remove the floating card effect on narrow screens while retaining 44px minimum interactive targets and preventing horizontal overflow.

### Task 3: Run local theme validation

**Files:**
- Test: `/private/tmp/sdh-shopify-theme/shopify/theme`

**Step 1: Run Shopify theme-check**

Run: `npx --yes @shopify/cli@latest theme check --path shopify/theme --config /tmp/sdh-theme-check.yml --fail-level error --output json --no-color`

Expected: zero errors; document any unrelated existing warnings.

**Step 2: Review the focused diff**

Run: `git diff -- shopify/theme/templates/product.json shopify/theme/assets/sdh-brand.css`

Expected: only the approved hierarchy and scoped product-detail styles are added.

### Task 4: Upload to the unpublished theme

**Files:**
- Upload: `assets/sdh-brand.css`
- Upload: `templates/product.json`

**Step 1: Validate the Admin GraphQL mutation**

Use the previously discovered `themeFilesUpsert` operation with target `gid://shopify/OnlineStoreTheme/139515527253`.

**Step 2: Upload both files together**

Expected: both filenames appear in `upsertedThemeFiles` and no user errors are returned.

### Task 5: Verify representative products

**Files:**
- Test: unpublished Shopify preview

**Step 1: Verify the Color Accent Mug**

Check the new hierarchy, swatches, Size and Logo color controls, media updates, Product details accordion, Add to cart, and accelerated checkout.

**Step 2: Verify a many-color shirt**

Check color and size selection, selected-value labels, media updates, option wrapping, and purchase controls.

**Step 3: Verify responsive behavior**

Check that the details column and variant controls remain readable and free of horizontal overflow at a narrow viewport.

**Step 4: Record the preview URL**

Return a direct product preview link and state that the redesign remains on the unpublished theme until approved.
