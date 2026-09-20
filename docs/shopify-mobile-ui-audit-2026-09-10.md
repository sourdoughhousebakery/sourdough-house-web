# Mobile shop UI audit — September 10, 2026

Status: source-code audit and user screenshot review complete; live mobile interaction audit pending. Computer Use reports the Mac is locked and cannot unlock it. No theme changes were uploaded or published during this audit.

Scope: existing Sourdough House design preview, theme 139515527253. Preserve its cream/gold styling and shared bakery header. Sources inspected under `/private/tmp/sdh-shopify-theme/shopify/theme`. Current remote files have not been compared during this pass.

## Confirmed findings

- `sections/sdh-real-range.liquid:14` — Category arrows use the Unicode character ↗. The supplied iPhone screenshot confirms it renders as a boxed emoji. The same character appears in the Shop all link (line 4) and Choose options links (line 26). Replace these decorative characters with an inline SVG in currentColor; preserve their small size and existing layout. An SVG removes dependence on the platform emoji font.
- `snippets/variant-picker-styles.liquid:370` and `config/settings_data.json:95` — Color swatch labels have zero padding and no minimum height; swatches are configured at 34 × 34 px. This is below the preferred 44 px touch area for comfortable phone use, though it does not by itself establish a WCAG minimum-target failure. Keep compact visible color squares and provide a larger, non-overlapping label hit area. Verify dense color rows after adjusting spacing.
- `assets/sdh-brand.css:555` — The Size guide close button overrides the base theme's safe-area-aware top/right offsets with fixed .75rem values. The dialog becomes full screen on mobile. Restore safe-area offsets to avoid notch/status-area conflicts in edge-to-edge contexts. Code-level defect; actual obstruction has not been reproduced on device.
- `assets/sdh-brand.css:214` — Breadcrumb links have no padding or minimum touch height and use .75rem text with 1.5 line height (about 18 px at the default root size). Enlarge their touch area while preserving the shared header alignment. Usability recommendation; verify wrapping with long category/product names.

## Existing protections found in source

- Header account/cart/menu controls have 44 px targets.
- Size guide uses a native modal dialog, scroll lock, and a horizontally scrollable chart container.
- Category menu becomes an in-flow single-column panel on mobile; Escape closes it and returns focus.
- Breadcrumbs wrap and truncate the current product label on small screens.
- Purchase controls stack at 390 px and below to avoid squeezing Add to cart beside quantity.
- Custom theme includes visible focus styles and reduced-motion handling.

These are source observations, not live-browser pass results.

## Remaining mobile checks after Mac unlock

Test 375/390 px phone widths, a narrow 320 px view, and landscape/tablet where supported. Inspect home/category cards, open mobile and category menus, category filters/sorting, a dense apparel swatch picker, the multi-option Color Accent Mug, gallery color switching and swipe controls, product details, size-guide open/scroll/close, and cart drawer. Check horizontal overflow, sticky-header overlap, long titles, text scaling, touch targets, keyboard focus, and empty/out-of-stock states. Do not place an order or publish the draft theme.

The black Shopify Draft toolbar in the supplied screenshot is preview tooling, not the storefront's category-card design.

Review reference: [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md).
