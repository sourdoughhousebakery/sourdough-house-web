# Sourdough House Bakery — Shopify Integration PRD

Status: architecture approved September 6, 2026. Custom draft uploaded; browser review pending. See the implementation checkpoint below.

This is the current Shopify direction. It updates the PRD reviewed in the **Shopify Preview SDH** conversation. The earlier custom Stripe/Printful build remains a preserved alternative; it is not the implementation plan for this approach.

Related documents:

- [Design system and component mapping](SHOPIFY_DESIGN_SYSTEM.md)
- [Implementation sequence](docs/plans/2026-09-06-shopify-native-store-implementation.md)
- The earlier custom-store checkpoint remains in the canonical project’s `docs/plans/2026-09-06-custom-merch-store-implementation.md`.

## 1. Objective and decision

Keep the bakery website on Vercel and build a native Shopify merchandise storefront that carries the same visual identity. Shopify owns commerce and customer accounts; Printful will handle merchandise production and fulfillment when separately configured.

| Experience | Intended address | Owner |
| --- | --- | --- |
| Bakery homepage, menu, story, ordering information, contact | `https://www.sourdoughhousebakery.com` | Existing Vercel application |
| Merchandise storefront, collections, products, cart | `https://shop.sourdoughhousebakery.com` | Native Shopify Online Store |
| Customer sign-in, profile, addresses, order history | `https://account.sourdoughhousebakery.com` | Shopify customer accounts, subject to domain configuration verification |
| Merchandise checkout and order status | Shopify-provided URLs on the configured store | Shopify |
| Baked-goods ordering and pickup | Existing Hotplate destination | Hotplate |

These are intended public domains, not a statement that their DNS has been verified or changed. Preserve the root domain's current Vercel routing and canonical redirect behavior. Do not move the domain registration or Google Workspace email.

### Why this approach

The owner wants to evaluate Shopify's native tools while keeping the bakery site they like. Recreating the store's visual presentation in a theme avoids building separate product, cart, checkout, authentication, and order-management systems in Vercel. Native Shopify can be customized through Liquid, HTML, CSS, JavaScript, theme sections, and blocks; this is more than a theme color change.

The tradeoff is maintaining two presentations of the brand. Navigation, contact links, fonts, and colors do not automatically synchronize. Checkout and hosted accounts have different customization limits from storefront theme pages. A visually coherent transition is the target; identical markup, shared application state, and identical layouts on every hosted page are not requirements.

## 2. Verified store state and unresolved items

Initial read-only Shopify checks on September 6, 2026 established (superseded where noted in the implementation checkpoint):

- Connected store: `ku4tbz-mj.myshopify.com`, display name `My Store`.
- Shopify plugin connection in Codex works; store details report `trial`.
- The owner reports Shopify Support is updating the existing store's trial. **The actual expiration date has not been verified in Settings → Plan.** Do not record a four-month entitlement as completed until that date is visible.
- Theme inventory returned one theme: **Horizon**, role `MAIN`, theme ID `139513266261`, theme-store ID `2481`. It was not processing and reported no processing failure.
- `read_themes` access was demonstrated by listing the theme and its relevant filenames. Theme write access, file upload capability, and CLI authentication are not yet proven.
- No unpublished theme was present at the time of this check. No theme was duplicated or modified during discovery.
- Shopify CLI was not available on the current shell path. It was not installed during this phase.
- Printful has not been connected to this Shopify store in this task. Existing Printful templates are not proof of order-ready Shopify listings.

Use this existing store. Do not resume preview/claim signup, create a replacement store, change the login email, or create an email alias as part of theme work.

## 3. Current Vercel architecture

| Area | Evidence and implications |
| --- | --- |
| Framework | `package.json` declares Next.js `^16.2.6`, React/React DOM `^19.2.6`, TypeScript `^5.7.3`; these are manifest ranges, not claims about a newly installed runtime. |
| Routing | App Router under `app/`; public routes `/`, `/menu`, `/story`, `/order`, `/contact`; protected bakery administration under `/admin`. |
| Styling | Tailwind v4 via `@tailwindcss/postcss`; brand tokens and global styles in `app/globals.css`. |
| Shared shell | `app/layout.tsx` renders `SiteHeader`, page content, `SiteFooter`, and `StickyOrder`. Header receives a Hotplate order URL. |
| Typefaces | DM Sans, DM Serif Display, Caveat imported through `next/font/google` in `app/layout.tsx`. No source font binaries are stored under `public/`. |
| Content | `content/site-content.ts` contains navigation and fallback copy. `lib/admin-data/source.ts` selects disk or Supabase-backed bakery content. Local `data/*.json` is not necessarily the current production content. |
| Hotplate | `lib/hotplate/` provides menu/drop information and handoff URLs; bakery checkout remains on Hotplate. |
| Interactive UI | React mobile menu, product-detail dialog, catalog tabs, refresh behavior, scroll-sensitive mobile order action, and `motion/react` sections. |
| Assets | Brand SVGs and icons in `public/`; bakery imagery also comes from remote sources permitted in `next.config.ts`. |
| Deployment | README records Vercel deployment from `sourdoughhousebakery/sourdough-house-web`; pushing `main` triggers production deployment. No push/deployment belongs in discovery or theme review. |
| Domain configuration | `lib/site.ts` uses `NEXT_PUBLIC_SITE_URL`, with a Vercel fallback that differs from the deployment URL in README. Treat neither fallback as authoritative for the custom domain. Verify production settings before launch; do not print environment secrets. |
| Existing commerce | The canonical checkout contains no Shopify storefront integration. A separate, paused custom-merch worktree exists; do not merge it into this Shopify approach. |

The bakery admin and its existing data storage continue independently. The Shopify theme must not fetch bakery admin endpoints, copy admin authentication, or require a new Vercel commerce database.

## 4. Customer experience and navigation

Use **Shop** for the merchandise link so it is distinct from **Order** and **Order on Hotplate**. Retain the current Menu, Story, Order, Contact labels. The brand wordmark links to the bakery homepage. Add Shop to both header and footer when launch is approved.

| Visible item | Existing Vercel route | Target used from Shopify |
| --- | --- | --- |
| Sourdough House Bakery wordmark | `/` | `https://www.sourdoughhousebakery.com/` |
| Menu | `/menu` | `https://www.sourdoughhousebakery.com/menu` |
| Story | `/story` | `https://www.sourdoughhousebakery.com/story` |
| Order | `/order` | `https://www.sourdoughhousebakery.com/order` |
| Shop (new) | Link added only at launch | Storefront root via Shopify's native routes |
| Contact | `/contact` | `https://www.sourdoughhousebakery.com/contact` |
| Order on Hotplate | Dynamic drop URL or bakery profile | Bakery `/order` page during initial theme preview; use a verified current Hotplate destination at launch |
| Cart | No Vercel cart state | Shopify cart route, available within the Shopify store only |
| Account | No Vercel customer authentication | Shopify account link; custom account domain only after configuration succeeds |

Bakery-to-merch and merch-to-bakery links navigate in the same tab. Preserve existing bakery behavior for external Hotplate links. Use absolute URLs for cross-site links and Shopify route objects for internal merchandise navigation. Do not add `/shop` as a new Vercel storefront or assume `/our-story` exists.

### Cross-site state

- The merchandise cart belongs to Shopify. Vercel does not display a live item count or signed-in customer name in v1.
- The only Vercel additions are a Shop link in the header and footer. Cart and account controls remain inside Shopify.
- Returning to the bakery website should not trigger cart deletion. Verify return-to-store cart behavior in the browser with the actual Shopify theme/session.
- Hotplate and Shopify have separate carts, payments, accounts, order confirmations, and support flows. No combined bakery/merchandise checkout is promised.
- Shared branding is not single sign-on. The existing Vercel admin account remains a bakery administration account only.

## 5. Theme implementation strategy

Start from an **unpublished duplicate of the connected store's Horizon theme**, after recording its actual version and backing up the files. Retain the published Horizon theme as the original. A paid theme purchase is not part of this plan.

Create a small, identifiable Sourdough House customization layer: design-token stylesheet, brand assets, brand-lockup snippet, header/footer presentation changes, and editable merchandise intro content. Prefer existing Horizon settings and blocks for product information, variants, media, recommendations, cart, and account controls. Do not replace working native commerce components simply to match a CSS class name.

The source Vercel React components cannot be dropped directly into Liquid. Reproduce their HTML/CSS appearance and simple interactions using theme-compatible code. Preserve theme section editor behavior and accessibility. Keep store business content editable through Shopify rather than hard-coding it into a large CSS/HTML mockup.

Target a custom storefront, not a screenshot-only imitation:

- Matching wordmark/dragonfly artwork, typography, cream background, warm palette, pill-shaped navigation/buttons, soft shadows, and rounded cards.
- Editable Shopify homepage and collection/product templates.
- Functional native option selection, product media, pricing, availability, cart quantity changes, removal, and checkout handoff once approved test products exist.
- Visible cart/account actions on the merchandise site; bakery ordering stays available but secondary.
- Responsive layout without squeezing the long brand name and all navigation into an unusable header.

All first-pass changes target the unpublished theme ID explicitly. Re-read its role before each upload and stop if it is `MAIN`. Do not use a publish flag, overwrite the original theme, connect DNS, or activate a plan to get around a tooling limitation.

## 6. First review: prove the custom look before expanding

The first visual review covers:

1. Shop homepage: custom header, bakery brand artwork, merchandise intro, three product categories, and footer.
2. A collection layout with clear image treatment and category/price placement.
3. One product detail layout showing media, valid options, description, and cart action.
4. Cart presentation, including the empty state.
5. Mobile navigation and keyboard focus behavior.

Use clearly labeled design samples until approved Shopify products exist. Sample blocks must not claim Printful connectivity, stock, sales, reviews, delivery dates, or approved retail prices, and must not submit production orders. Prefer theme-editor sample data or preview-only sample blocks with purchase disabled. Draft products do not automatically become browsable products on an ordinary storefront.

An unpublished theme isolates theme code, **not** products, navigation menus, files, store settings, or apps. Do not publish real products to the shared Online Store sales channel just to make the preview look full. Product availability and storefront password protection need a separate deliberate decision before commerce testing.

This review is the decision point for whether Shopify looks sufficiently like Sourdough House to justify further setup. It is not proof that checkout, fulfillment, or the trial is ready.

## 7. Customer accounts and checkout

Use Shopify-hosted customer accounts and checkout. Match supported logos, colors, fonts, and links; do not promise the Vercel header/footer or page structure can be replicated there without platform restrictions. Verify capabilities on the actual store/plan before specifying advanced customization or extensions.

Configure the intended customer-account subdomain through Shopify's current account-domain workflow and validate the resulting hostname before changing DNS. Do not silently assume the store subdomain produces the desired sibling account hostname.

Customer order history is merchandise history only. Returns require configured return rules and an owner-approved policy; an account page alone does not establish return eligibility or refund automation. Printful cancellation, Shopify refund, and order status are separate operational decisions.

The owner has not authorized choosing a paid plan, purchasing apps, or configuring payments. Shopify Payments and the owner's standalone Stripe account are distinct setups. Do not copy standalone Stripe credentials into this native Shopify project.

## 8. Printful and catalog responsibilities

Printful integration is a later milestone. Reuse the owner's existing reviewed designs where appropriate; preserve their files and template IDs. The earlier local inventory is a dated design reference, not current Shopify inventory or a verified fulfillment mapping.

| Information | Responsible system |
| --- | --- |
| Bakery content and Hotplate handoff | Existing bakery application/Hotplate |
| Merchandise customer-facing catalog, retail prices, collections, orders, discounts | Shopify |
| Artwork, production variants, production billing, fulfillment | Printful integration |
| Shop presentation | Versioned Shopify theme + documented design system |
| Product approval, margins, shipping destinations, returns, exception handling | Bakery owner |

During the later Printful phase, connect the intended Printful account/store, publish or synchronize a small approved collection, and verify exact garment/size/color/artwork mappings. Do not rebuild the custom-worktree Printful importer for this approach. Verify which fields synchronize and preserve intentional Shopify copy/price edits.

Production costs are not retail prices. Physical sample quality, shipping charges, production funding, return policy, and order acceptance settings must be resolved before launch. A template screenshot or a Shopify test order alone does not prove Printful fulfillment works.

## 9. Domain, release, and operating boundaries

- Keep root and `www` on Vercel. Add only the intended Shopify subdomain records when release is authorized.
- Preserve MX, SPF, DKIM, DMARC, existing verification records, and unrelated DNS entries. Do not apply whole-domain Shopify instructions to the bakery domain.
- Record original DNS values, verify TLS, and test navigation after propagation.
- Use Shopify's native canonical URLs for merchandise. Keep Vercel's sitemap limited to its own pages; do not duplicate product pages in both systems.
- Configure measurement/consent for journeys between the sites without double-counting purchases. Document which system sends each email.
- Maintain a short record of theme changes and their base Horizon version. Re-test theme updates; custom files do not automatically survive an upgrade without review.
- At launch, the only intended Vercel product change is adding the approved Merch/navigation links (plus any separately approved copy). Do not deploy the custom-merch worktree.

## 10. Preserve the alternative and evaluate value

The paused custom approach is on `codex/merch-store`, with a separate `codex/merch-preview` branch. Its checkpoint is documented in the linked custom-store plan. Leave those worktrees, uncommitted changes, assets, and tests intact. This phase does not resume them.

Evaluate the Shopify trial using the same representative product and design standards:

- How closely does the shop match the bakery on desktop and mobile?
- Can the owner edit products and handle orders without developer intervention?
- Does Printful publish the intended variants and handle a controlled order correctly?
- Are checkout, customer accounts, shipping, tax configuration, notifications, and support usable?
- What are the actual recurring Shopify/app/processing costs after the trial?
- What ongoing maintenance and operating costs would the custom approach incur?

Do not assume building our own store automatically saves money. Keep the alternative available, but compare total costs and owner effort before making that decision. Migration of customer identities, order history, and payment methods would need separate planning; preserving source code is not a complete commerce rollback.

## 11. Milestones and completion gates

| Milestone | Completion evidence |
| --- | --- |
| Phase 1: discovery and planning | This PRD, sourced design specification, actual theme inventory, current navigation and asset map; no production changes |
| Phase 2: custom visual proof | Unpublished theme ID and actual preview URL; desktop/mobile screenshots; owner review of homepage, collection, product, cart |
| Phase 3: merchandise operations | Explicit Printful authorization, approved real listings, pricing/shipping/policies, tested account and payment configuration; no unintended production orders |
| Phase 4: launch | Trial expiration verified; owner-approved plan/spend if needed; purchase/fulfillment test evidence; approved theme publication and DNS/navigation changes |
| Evaluation | Owner decides whether to continue Shopify using actual design, operating experience, and cost evidence |

A successful connection is not trial verification. A successful upload is not a visually verified theme. A theme preview is not a selling store.

## Sources and verification scope

Repository source and read-only Shopify inventory were inspected September 6, 2026. No source application code, catalog data, DNS, theme, plan, app, payment setting, or Printful configuration was changed for Phase 1.

- [Shopify theme architecture](https://shopify.dev/docs/storefronts/themes/architecture)
- [Shopify Horizon source](https://github.com/Shopify/horizon)
- [Duplicating Shopify themes](https://help.shopify.com/en/manual/online-store/themes/managing-themes/duplicating-themes)
- [Shopify on a subdomain while another website uses the root](https://help.shopify.com/en/manual/domains/add-a-domain/connecting-domains/connect-subdomain)
- [Customer-account custom domains](https://help.shopify.com/en/manual/customers/customer-accounts/customize-customer-accounts/connect-domain-customer-account)
- [Checkout branding and plan-dependent limits](https://help.shopify.com/en/manual/checkout-settings/customize-checkout-configurations/checkout-style)
- [AI-created store trials and claiming](https://help.shopify.com/en/manual/ai-powered-tools/connecting-ai-tools/setting-up-a-store-created-with-ai)

## Implementation checkpoint — September 6, 2026

- Created the unpublished **Sourdough House - design preview** theme (`139515527253`) from Horizon 4.1.5. Theme write access is now proven.
- Exported 481 baseline files and built/uploaded the branded header, footer, homepage, fonts, original logos, and labeled non-purchasable sample cards. Native cart/account controls are retained.
- Staged exactly one Shop navigation entry, used by both Vercel header and footer. The target subdomain is intended, not yet verified; this change is not deployed.
- Theme Check reports zero findings. Vercel lint and type checking pass. Uploaded text/settings match their local versions.
- Browser review is blocked by the separate Shopify login/password page. Desktop/mobile rendering, product/cart behavior, Settings → Plan expiration, Printful, DNS, and launch remain incomplete.
- Code is preserved on `codex/shopify-theme`; implementation details and validation are in `shopify/README.md` on that branch. The earlier custom-store alternative remains preserved.
