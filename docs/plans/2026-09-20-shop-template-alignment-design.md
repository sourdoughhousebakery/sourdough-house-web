# Shop Template Alignment Design

## Goal

Align collection product grids, product details, and product recommendations with the same centered desktop content edges used by the bakery header and shop homepage.

## Evidence and root cause

At a 1,835 px viewport, the branded header is 1,152 px wide and begins at x=341.5. The native collection grid and product layout are 1,440 px wide and begin at x=197.5. The active Horizon theme applies `page-width-narrow` to the body, but its `--narrow-page-width` token is currently `90rem` (1,440 px). The bakery-specific shell already resolves to 1,152 px of inner content.

## Considered approaches

1. **Unify the native narrow-width token at 72rem (recommended).** One bakery-scoped token change makes every native narrow section use the established 1,152 px content width. Horizon's collection grid already uses `auto-fill` with a 250 px minimum, so it naturally changes from five columns to four without template-specific overrides.
2. **Widen the homepage and branded shell to 90rem.** This preserves five collection columns but weakens the deliberate centered composition and makes the homepage materially wider than its current design.
3. **Add per-template max-width overrides.** This can visually align individual sections, but it duplicates layout rules across collection, product, and recommendation selectors and is more fragile during theme updates.

## Approved design

Use the first approach. Add `--narrow-page-width: 72rem` to the existing `body.sdh-store` rule in `assets/sdh-brand.css`. Do not change Shopify template JSON or native section settings.

The resulting desktop system is:

- Header: 72rem.
- Branded shell and breadcrumbs: 72rem inner content plus their existing 1.5rem gutters.
- Collection heading, filters, and product grid: 72rem.
- Product gallery/details and recommendations: 72rem.
- Collection cards: four columns where the existing 250 px minimum permits it.
- Mobile and tablet: retain Horizon's existing fluid width and breakpoints.

## Verification

Verify the active theme file contains the bakery-scoped token, then measure the live collection and product DOM at desktop width. The collection grid, product component, and recommendation list must share the header's left and right edges. Confirm the collection grid resolves to four columns and that neither collection nor product pages introduces horizontal overflow at desktop or mobile widths.

