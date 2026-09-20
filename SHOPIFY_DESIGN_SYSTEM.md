# Sourdough House Bakery — Shopify Design System

Status: source-derived specification, September 6, 2026. This documents the current canonical Vercel checkout and the proposed Shopify translation. It is not a claim that an implemented Shopify theme already matches the website.

Use with [the integration PRD](SHOPIFY_INTEGRATION_PRD.md) and [implementation plan](docs/plans/2026-09-06-shopify-native-store-implementation.md). Existing website code remains the visual source of truth. Values below are explicit source values or conversions from the installed Tailwind defaults; pixel equivalents assume a 16px root size.

## 1. Source map

| Source | What to preserve |
| --- | --- |
| `app/globals.css` | Brand tokens, background, focus, selection, reduced motion, modal shell |
| `app/layout.tsx` | Font families, global shell, skip link |
| `components/site-header.tsx` | Floating rounded navigation, wordmark, link state, mobile disclosure |
| `components/site-footer.tsx` | Three-column desktop footer, logo lockup, navigation/contact groups |
| `components/button-link.tsx` | Four button variants, sizing, focus/hover behavior |
| `components/brand-logo-lockup.tsx` | Exact two-SVG logo composition and coloring |
| `components/page-intro.tsx` | Centered eyebrow, editorial heading, supporting copy |
| `components/hero.tsx` | Large brand lockup, responsive split composition and headline scale |
| `components/catalog-grid.tsx` and `components/menu-grid.tsx` | Rounded cards, image proportions, category/title/price hierarchy |
| `components/menu-tabs.tsx` | Filter/tab surfaces and responsive controls |
| `components/menu-item-detail-modal.tsx` | Dialog spacing, image/copy columns, typography |
| `components/admin-preview-content.tsx` | Announcement presentation and social controls |
| `components/motion-section.tsx` | Reduced-motion-aware section animation conventions |
| `components/sticky-order.tsx` | Existing mobile Hotplate action; do not blindly port to merchandise |
| `content/site-content.ts` | Actual Menu, Story, Order, Contact labels/routes |
| `lib/site.ts` | URL construction and fallback social/contact handling |

## 2. Color tokens

Copy these as a small theme-owned token layer (proposed filename `assets/sdh-brand.css`). Do not copy the whole Tailwind runtime or all bakery application CSS.

| Token | Value | Usage |
| --- | --- | --- |
| `--color-cream` | `#fff7ea` | Primary page surface, light text on espresso |
| `--color-cream-soft` | `#fffaf2` | Gentle background variation |
| `--color-gold` | `#e6a33a` | Primary action background, warm accent |
| `--color-gold-dark` | `#cc8325` | Primary button hover |
| `--color-rust` | `#bd553d` | Eyebrows, accents, active links, focus outline |
| `--color-espresso` | `#39271b` | Primary text and dark surfaces |
| `--color-espresso-dark` | `#24180f` | Dark button hover |
| `--color-sage` | `#647f4f` | Category labels |
| `--color-sky` | `#5f93b5` | Available secondary accent; avoid adding gratuitously |
| Logo display color | `#5a4639` | Hero/footer vertical brand lockup |
| White | `#ffffff` | Cards and selected control surfaces |

Existing opacity treatments include espresso at 10% for borders, 66–75% for secondary text; gold at 20–25% for borders; cream at 88% for the desktop header; white at 70% for secondary buttons. Use alpha colors, not opacity on entire text containers. Re-check actual contrast on rendered merchandise surfaces; matching a source token is not proof of accessibility.

Background from `app/globals.css`:

```css
background:
  radial-gradient(circle at top left, rgba(230, 163, 58, 0.22), transparent 34rem),
  linear-gradient(180deg, #fff7ea 0%, #fffaf2 48%, #fff7ea 100%);
color: #39271b;
```

Apply the brand tokens to Horizon's actual supported variables/color schemes after inspecting the installed files. Avoid broad overrides that erase validation, disabled, sold-out, selected-option, or app-component states.

## 3. Typography

| Role | Family and source configuration |
| --- | --- |
| Body, navigation, controls | **DM Sans**, variable import from `next/font/google` |
| Editorial headings | **DM Serif Display**, weight 400 |
| Handwritten accents and current header wordmark | **Caveat**, variable import |

Existing class weights: semibold 600, bold 700, black 900 where the family supports them. Do not synthesize unavailable serif weights to match sans-serif controls. Future Shopify font assets should come from properly licensed font sources or verified Shopify font options; do not link a theme to Next.js's generated `/_next/static/media/` filenames.

| Element | Size / line height | Other attributes |
| --- | --- | --- |
| Header wordmark | 20px; 24px from 640px wide | Caveat 700 |
| Navigation/buttons | 14px / 20px | DM Sans 700 |
| Hero headline | `clamp(2.6rem, 5.8vw, 5.5rem)` / 0.98 | DM Serif Display 400 |
| Page intro headline | 48px; 72px from 768px wide / 0.95 | DM Serif Display 400 |
| Section heading | Typically 36px; 48px on wider screens / 1.25 or 1 | Source varies by component |
| Product-card title | 24px / 1.25 | DM Serif Display 400 |
| Current card price/accent | 24px / 32px | Caveat 700; rust |
| Page-intro description | 18px / 32px | Secondary espresso, max 672px |
| Card body | 14px / 24px | Secondary espresso |
| Eyebrow | 12–14px / 16–20px | 900, uppercase, tracking 0.14–0.18em |

Keep commerce prices, size labels, totals, and error text easy to scan. If Caveat makes a long price/discount combination hard to read, use DM Sans for transactional figures and retain Caveat for decorative accents. Do not obscure currency or unavailable-price states to preserve a visual motif.

## 4. Layout, spacing, and responsive rules

The source uses a 4px spacing unit (`--spacing: 0.25rem`). Preserve rem-based sizing for text and most dimensions.

| Source utility/pattern | Equivalent |
| --- | --- |
| `max-w-6xl` primary shell | 72rem / 1152px |
| `max-w-5xl` contact area | 64rem / 1024px |
| `max-w-4xl` intro/dialog content | 56rem / 896px |
| `max-w-3xl` supporting text area | 48rem / 768px |
| `max-w-2xl` intro body | 42rem / 672px |
| `max-w-xl` hero body | 36rem / 576px |
| Typical page side padding | 1.25rem / 20px |
| Header outside padding | 1rem / 16px top and sides |
| Card grid gap | 1.25rem / 20px |
| Card inside padding | 1.25rem / 20px |
| Intro section | 9rem / 144px top, 3rem / 48px bottom |
| General section vertical spacing | 2.5–5rem / 40–80px, by component |
| Main hero top padding | 7rem / 112px; 9rem / 144px at md |

Breakpoints verified in the installed Tailwind defaults:

- `sm`: 40rem / 640px — inline CTA groups, larger wordmark.
- `md`: 48rem / 768px — source desktop navigation, two-column catalog, larger intro headings.
- `lg`: 64rem / 1024px — three-column catalog and some split story layouts.
- `xl`: 80rem / 1280px; `2xl`: 96rem / 1536px — defaults exist but are not necessary new layout requirements.

Source catalog uses one column below md, two from md, three from lg. Start there for the merchandise proof rather than forcing tiny mobile cards. Product detail should use a stacked layout on narrow screens and a media/details split when content fits.

The added Shop, Account, and Cart controls increase header width. A later collapse breakpoint is an acceptable Shopify adaptation if needed; preserve a clear mobile menu and avoid clipped text at 768–1024px.

## 5. Surfaces, borders, shadows

| Element | Specification |
| --- | --- |
| Header/buttons/badges | Fully rounded pill |
| Catalog cards | 1.5rem / 24px radius; 1px espresso 10% border; white background |
| Large feature panels | 2rem / 32px radius |
| Announcement | 1.25rem / 20px radius; rust 15% border; white |
| Mobile menu panel | 1.5rem / 24px radius; cream; gold 20% border |
| Mobile menu links | 1rem / 16px radius |
| Soft shadow | `0 12px 34px rgba(57,39,27,0.1)` |
| Lift shadow | `0 24px 70px rgba(57,39,27,0.18)` |
| Source dialog backdrop | Espresso 70%, 4px blur |

Header backdrop uses `backdrop-blur-xl` (24px under current Tailwind defaults), an espresso-safe light surface, and soft shadow. Provide a readable opaque fallback. Keep focus rings outside rounded cards visible; avoid ancestor overflow clipping them.

## 6. Buttons, links, and interaction

Base button: inline flex; centered content; minimum height 48px; 20px horizontal padding; 14px/20px DM Sans 700; fully rounded; 200ms transition.

| Variant | Default | Hover |
| --- | --- | --- |
| Primary | Gold, espresso text, `0 16px 40px rgba(223,153,49,.28)` shadow | Gold-dark, translate Y -2px |
| Secondary | White 70%, espresso text, 1px espresso 18% border | White, espresso 35% border, Y -2px |
| Dark | Espresso, cream text, `0 18px 42px rgba(54,36,25,.28)` shadow | Espresso-dark, Y -2px |
| Light | White, espresso text, `0 16px 34px rgba(54,36,25,.14)` shadow | Y -2px |

Source uses some compact 40px CTA variants. For new commerce/mobile interactions, use at least 44px targets, ideally 48px; do not reduce target size solely to match compact desktop styling.

Native Shopify states must remain explicit: loading, unavailable, sold out, validation error, success, quantity limit, and disabled checkout. Errors use readable text and an announced status; color alone is insufficient. Keep native button/form semantics and duplicate-submit handling.

Source card hover moves up 4px over 300ms, adds lift shadow, and scales imagery to 1.04 over 500ms. Apply only where pointer behavior makes sense and disable nonessential movement for reduced motion.

Global focus: 2px rust outline with 4px offset. Keep skip-to-content behavior and visible keyboard focus. Menu button exposes its expanded state, closes with Escape, and restores focus; drawer/dialog implementations also need appropriate focus containment and restoration. Use Horizon's native controls where possible.

The Vercel `MotionSection` declares `initial={false}`, an in-view target of opacity 1/Y 0, and a 0.65s transition. Do not infer or introduce a hidden initial fade. Plain visible sections with CSS hover transitions are an acceptable first Shopify translation.

## 7. Header and footer translation

### Header

The current header is fixed, z-index 50, inset 16px from the top/sides. Its inner navigation is max 1152px, padding 16px horizontal/12px vertical, cream 88%, gold 20% border, soft shadow, and a rounded-pill silhouette. Desktop links have 28px gaps. The brand name is text in Caveat, not the vertical SVG logo.

Retain that silhouette and typography. Add a clear active Shop state plus native cart/account actions. Allow responsive adaptation to the extra controls. Shopify should expose bakery destinations as absolute links and native shop destinations as route-aware links. Do not force the Vercel mobile Hotplate sticky bar onto every merchandise page.

### Footer

The current footer has a 1px espresso 10% top border, cream background, 20px side padding, 40px top padding, and 40px desktop bottom padding. Mobile bottom padding is 112px because the bakery has a sticky order action; reduce unnecessary space in the shop if that action is absent.

Inside: max 1152px, 32px gaps; three desktop columns in ratio `1.2fr 1fr 1fr`, stacked on mobile. The first column centers a 170px vertical logo. Group headings use 14px bold/black uppercase rust with 0.14em tracking. Links are 14px semibold secondary espresso. Social targets are 44px circular white controls with 18px icons.

Preserve the structure, then adapt the information: bakery exploration links, merchandise account/cart/policy destinations, and approved contact details. Keep pickup wording attached to bakery ordering, not merchandise shipping. Do not add unverified shipping or return promises.

## 8. Assets and content provenance

| Existing asset/data | Future use |
| --- | --- |
| `public/brand/logo-dragonfly.svg` | Copy unchanged into theme assets when implementation starts |
| `public/brand/logo-text.svg` | Copy unchanged alongside dragonfly asset |
| `public/favicon.svg` | Review for Shopify favicon support; convert only if required |
| `public/apple-icon.svg` | Reference for icon consistency; not a guaranteed supported direct upload |
| `components/brand-logo-lockup.tsx` | Translate composition into a Liquid snippet and CSS; do not redraw artwork |
| `content/site-content.ts` | Brand voice and route reference; bakery descriptions are not merchandise specifications |
| `data/admin-content.json` | Local contact/announcement reference only; reconcile against active production content before copying |
| `.qa/printful/` | Preserved design research; not automatically approved product photography |

Exact logo composition from source:

- Horizontal: 12px gap; mark 30% of total width; wordmark 66%; source default total width 220px.
- Vertical: mark width 92%, negative bottom margin 13%, translate X 3% and Y 20%, scale Y 0.8, transform origin top, z-index 10; text width 100%, z-index 20.
- Mark wrapper aspect ratio `210 / 128`; text wrapper `210 / 114`.
- Both SVGs are CSS masks, centered, contained, no-repeat, with a configurable solid background color and WebKit mask equivalents. Preserve an accessible outer brand label and decorative inner elements.
- Hero total width: `clamp(180px,25vw,360px)`; footer: 170px; optional standalone brand panel: `clamp(220px,28vw,360px)`.

There are no local bakery-photo source files under `public/` in this checkout. Remote imagery appears in page/content source. Do not repurpose a bread photograph as a garment mockup. Existing Printful review JPGs include full dashboard screenshots and production prices; they are unsuitable as customer-facing product images without obtaining approved clean assets.

Source contact values differ: `lib/site.ts` contains generic defaults, local editable content has another public email, and the Shopify admin login is different again. Do not decide the customer-support address from those differences. During the initial proof, link to the bakery Contact page. Copy the active owner-approved support and social links at launch; hide unused social icons.

## 9. Mapping to the actual installed Horizon theme

Read-only filename inventory on September 6, 2026 verified the existing files listed below in theme `139513266261`. The file bodies/base version have not yet been downloaded. Proposed `sdh-*` files do not exist yet. Inspect actual rendering and settings before modifying these seams.

| Vercel source | Verified Horizon seam | Proposed adaptation |
| --- | --- | --- |
| `app/layout.tsx`, `app/globals.css` | `layout/theme.liquid`, `config/settings_schema.json` | Add brand stylesheet; configure native fonts/colors; keep Shopify-required output and native scripts |
| `SiteHeader` | `sections/header.liquid`, `sections/header-group.json` | Match pill shell and navigation; retain native account/cart/menu functionality |
| Announcement | `sections/header-announcements.liquid` | Use shop-specific editable message or omit when no approved message exists |
| `SiteFooter` | `sections/footer.liquid`, `sections/footer-utilities.liquid`, `sections/footer-group.json` | Match layout, artwork, links; retain native policy/localization elements when used |
| `BrandLogoLockup` | Layout/header/footer rendering seams | Proposed `snippets/sdh-brand-lockup.liquid` + unchanged SVG assets |
| `Hero`, `PageIntro` | Section architecture in homepage/collection templates (inspect files first) | Proposed `sections/sdh-merch-intro.liquid` with editable copy/settings |
| Catalog cards | `blocks/product-card.liquid`, `blocks/_product-card.liquid`, `blocks/_product-card-gallery.liquid`, `sections/product-list.liquid` | Restyle native cards; keep product links, price/availability, media behavior |
| Bakery detail dialog | `sections/product-information.liquid`, `blocks/_product-details.liquid`, `blocks/_product-media-gallery.liquid` | Use real Shopify product pages; do not recreate the bakery modal as the core purchase flow |
| Buttons | `snippets/add-to-cart-button.liquid`, `snippets/add-to-cart-button-styles.liquid` | Apply brand styling while preserving form state and native variant submission |
| New cart | `snippets/cart-drawer.liquid`, `snippets/cart-items-component.liquid`, `snippets/cart-products.liquid`, `snippets/cart-summary.liquid`, `snippets/cart-bubble.liquid` | Brand existing cart and empty/error states; preserve quantity/removal/totals behavior |
| New related merchandise | `sections/product-recommendations.liquid`, `blocks/product-recommendations.liquid` | Use native recommendations when real products are available |
| Mobile menu | Native header implementation; inspect included snippets first | Preserve accessible behavior and adapt spacing/collapse breakpoint |

Do not assume a Dawn file layout applies to Horizon. Do not replace this installed theme with an arbitrary latest upstream release without reviewing the differences. Keep reusable customization code in a separate `shopify/theme/` tree during implementation, isolated from the Next.js app.

## 10. Differences and simplest compatible treatment

| Difference | Treatment |
| --- | --- |
| React/Next components and hooks | Translate appearance to Liquid/CSS; use native theme controls or small scripts for interaction |
| Next.js Image optimization | Use Shopify-hosted media and native responsive image output; preserve width/height/alt/loading behavior |
| Google fonts compiled by Next | Configure equivalent supported fonts or include licensed source font assets; never depend on hashed Vercel build assets |
| Bakery Supabase content/edit-preview events | No automatic cross-site sync; store shop copy in theme settings and maintain shared links deliberately |
| Live Hotplate schedule/order URL | Link back to bakery ordering information; no new live Hotplate integration inside the merchandise theme |
| Card dialog opens bakery details | Merchandise uses native product-detail pages, optionally native quick-add after verification |
| Mobile sticky pickup CTA | Omit on merchandise or replace with a separately reviewed native merchandise action |
| Customer identity/cart in two frontends | Shopify owns state; Vercel provides links, no live count or greeting |
| Hosted checkout/accounts | Supported brand settings, not arbitrary theme HTML; verify store-plan limits |
| Motion library | Keep visible content and lightweight transitions; no React runtime in the theme |
| Additional header controls | Collapse navigation sooner if necessary; prioritize clear links and touch targets |

## 11. Visual and functional review matrix

Review actual Shopify output at 390px and 1440px, plus the 768–1024px header range and 200% browser zoom. Capture paired bakery/shop screenshots at the same width. A local HTML rendering is useful for sketching but is not Shopify verification.

- Brand artwork and names match the source; no stretched or recolored logo assets beyond intended source treatment.
- Fonts actually load, heading/body hierarchy matches, and content remains readable while fonts load.
- Header, cards, controls, and footer use the documented dimensions; any deliberate differences are listed.
- Mobile navigation opens/closes, Escape restores focus, keyboard traversal is sensible, and nothing overflows horizontally.
- Reduced motion works; no content depends on animation becoming visible.
- Long titles, missing images, unavailable variants, and different prices remain legible.
- Samples are labeled and cannot purchase; real product availability and prices come from Shopify.
- Native cart actions remain correct after styling; failed add-to-cart does not present success.
- Bakery/Hotplate links do not imply pickup for Printful merchandise.
- No Vercel, DNS, paid-plan, or Printful changes are required to approve the first visual proof.
