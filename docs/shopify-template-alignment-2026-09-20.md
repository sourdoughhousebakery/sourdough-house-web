# Shopify Template Alignment — 2026-09-20

## Scope and identity

- Store: Sourdough House Bakery (`ku4tbz-mj`)
- Verified account: `admin@sourdoughhousebakery.com`
- Assigned browser profile: `sourdoughhousebakery.com`
- Theme: `Sourdough House - design preview` (`139515527253`), active at the time of the change
- Storefront state: private; Shopify still showed the launch prerequisite to add business details
- Requested scope: align collection and product template content with the homepage/header frame

The installed Shopify connector resolved to a different store and Shopify CLI did not have access to this store. Neither login was changed. The supported Theme editor Custom CSS setting was used instead, after the live store identity and theme were verified.

## Root cause

At a 1,835 px desktop viewport, the bakery header used a 1,152 px frame beginning at x=341.5 while Horizon's native collection and product sections used a 1,440 px frame beginning at x=197.5. The `page-width-narrow` body class was present, but Horizon's `--narrow-page-width` token resolved to `90rem` instead of the bakery shell's `72rem`.

After narrowing the product component, Horizon's default `2fr 1fr` desktop split left the option panel at 384 px and wrapped `2XL`. A scoped `16fr 9fr` split retained the shared frame while giving the option panel enough room.

## Saved theme CSS

Theme settings > Custom CSS now contains:

```css
.card {
  border-radius: 30px;
}

body.sdh-store {
  --narrow-page-width: 72rem;
}

@media screen and (min-width: 750px) {
  .sdh-store
    .product-information__grid:not(
      .product-information__grid--half,
      .product-information--media-none
    ).product-information--media-left {
    grid-template-columns: minmax(0, 16fr) minmax(0, 9fr);
  }
}
```

Shopify displayed `Changes saved.` after each update. No template JSON, section settings, theme assets, products, catalog data, orders, accounts, or unrelated store settings were changed.

## Verification

### Desktop — 1,835 px viewport

- Apparel collection header and product grid: x=341.5, width=1,152, right=1,493.5
- Apparel collection columns: 4
- Product page header, product component, and recommendations: x=341.5, width=1,152, right=1,493.5
- Product media/details columns: approximately 737/415 px
- Size options `S`, `M`, `L`, `XL`, and `2XL`: one row
- Horizontal overflow: 0 px on both pages

### Mobile — 390 × 844 viewport

- Apparel collection: two-column grid, existing fluid edges retained, horizontal overflow 0 px
- Product page: existing stacked layout retained; product component and recommendations width 390 px
- All five size options shared the same top coordinate
- Horizontal overflow: 0 px

Temporary browser viewport overrides were reset after testing.
