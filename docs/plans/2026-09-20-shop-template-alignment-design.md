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

Use the first approach. Add a bakery-scoped `body.sdh-store { --narrow-page-width: 72rem; }` rule through Horizon's supported theme-wide Custom CSS setting. Preserve its existing `.card` rule. Do not change Shopify template JSON, section settings, or theme assets.

At 72rem, Horizon's default desktop product split (`2fr 1fr`) leaves the option panel too narrow and wraps `2XL` onto a second row. Keep the entire product component inside the shared frame while changing only its desktop column ratio to `16fr 9fr`. The resulting media/details widths are approximately 737/415 px at the verified viewport, and all five size options remain on one row. Scope the rule to the bakery store body and Horizon's existing media-left product selector; keep it behind the existing 750 px desktop breakpoint so mobile remains unchanged.

The resulting desktop system is:

- Header: 72rem.
- Branded shell and breadcrumbs: 72rem inner content plus their existing 1.5rem gutters.
- Collection heading, filters, and product grid: 72rem.
- Product gallery/details and recommendations: 72rem.
- Product media/details desktop split: 16:9 inside the 72rem frame.
- Collection cards: four columns where the existing 250 px minimum permits it.
- Mobile and tablet: retain Horizon's existing fluid width and breakpoints.

## Verification

Verify the active theme's rendered CSS applies the bakery-scoped token, then measure the live collection and product DOM at desktop width. The collection grid, product component, and recommendation list must share the header's left and right edges. Confirm the collection grid resolves to four columns, the product size choices remain on one row, and neither collection nor product pages introduces horizontal overflow at desktop or mobile widths.
