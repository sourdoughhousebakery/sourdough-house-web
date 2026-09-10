# Shopify Product Title Cleanup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the 25 active Shopify product titles with the approved concise storefront names.

**Architecture:** Treat `2026-09-10-shopify-product-title-design.md` as the exact source of truth. Update Shopify's `Product.title` field through the Admin GraphQL API while explicitly resubmitting each existing handle unchanged, then read all active products back and compare exact ID-to-title and ID-to-handle pairs before checking representative storefront collection and product pages.

**Tech Stack:** Shopify Admin GraphQL API, Shopify storefront preview, Markdown project records.

---

### Task 1: Validate the Shopify mutation

**Files:**
- Reference: `docs/plans/2026-09-10-shopify-product-title-design.md`

1. Discover `productUpdate` and `ProductUpdateInput` in the connected Shopify Admin GraphQL schema.
2. Validate a parameterized mutation that updates `id`, `title`, and the existing unchanged `handle`, and returns `product { id title handle }` plus `userErrors`.
3. Confirm the mutation contains no variant, media, inventory, pricing, tag, or fulfillment fields.

### Task 2: Apply the approved title map

**Files:**
- Reference: `docs/plans/2026-09-10-shopify-product-title-design.md`

1. Submit the 25 ID-to-title updates sequentially through the validated mutation, including the current handle for each product.
2. Stop if any mutation returns a user error.
3. Record every returned ID, title, and handle for verification.

### Task 3: Verify Shopify and storefront output

**Files:**
- Modify: `docs/shopify-real-catalog-preview.md`

1. Fetch all active products from Shopify.
2. Assert there are 25 products and every ID has the exact approved title.
3. Assert every product retained its original handle.
4. Assert no title begins with `Sourdough House Bakery` or `SDHB`.
5. Open Apparel, Mugs, and Accessories in the unpublished Sourdough House preview and confirm the shorter titles render.
6. Open representative saying, logo garment, mug, and accessory product pages and confirm the page heading matches Shopify.
7. Record the completed cleanup in `docs/shopify-real-catalog-preview.md`.

### Task 4: Commit the durable record

**Files:**
- Modify: `docs/shopify-real-catalog-preview.md`
- Create: `docs/plans/2026-09-10-shopify-product-title-implementation.md`

1. Review the documentation diff.
2. Commit only the title-cleanup plan and completion record.
