# Native Shopify Merchandise Store Implementation Plan

> Implementation workflow: use the executing-plans skill for the approved milestones, with proportionate verification and the current user constraints. Do not resume the separate custom Stripe/Printful plan as part of this work.

**Goal:** Build a custom Sourdough House merchandise theme on the connected Shopify store, preserving Vercel for the bakery website and Hotplate for baked-goods ordering.

**Architecture:** Native Shopify Online Store on the intended `shop.sourdoughhousebakery.com` subdomain. Reuse Horizon's commerce components with a source-derived brand layer; Shopify hosts checkout/customer accounts. Printful and public launch follow explicit operational setup and owner review.

**Tech stack:** Existing Next.js/React/Tailwind bakery application as design reference; Shopify Horizon, Liquid, HTML, CSS, native theme JavaScript and Shopify-admin tooling for the merchandise store. No Shopify runtime dependency or headless commerce adapter is added to Vercel.

**Status:** Custom draft uploaded September 6, 2026; browser review pending. No live publication or production deployment has occurred. This plan implements [the approved PRD](../../SHOPIFY_INTEGRATION_PRD.md) and [design specification](../../SHOPIFY_DESIGN_SYSTEM.md).

## Milestone A — Discovery and scope (completed)

### Task 1: Inspect and preserve current work

Files read: `app/layout.tsx`, `app/globals.css`, `components/site-header.tsx`, `components/site-footer.tsx`, `components/button-link.tsx`, `components/brand-logo-lockup.tsx`, presentation components, `content/site-content.ts`, `lib/site.ts`, routing/deployment configuration, and the paused custom-store plan.

1. Read applicable project instructions and Git status.
2. Identify existing uncommitted catalog/content changes; preserve them.
3. Locate the paused `codex/merch-store` and `codex/merch-preview` worktrees; do not modify them.
4. Inventory connected Shopify themes through a validated read-only query.
5. Record the current Horizon theme ID `139513266261`, role `MAIN`, and actual relevant filenames. Confirm pagination finished.

Acceptance: canonical website remains unchanged; custom fallback work remains preserved; no assumption of theme-write access or four-month trial expiration.

### Task 2: Write the design contract

Files created: `SHOPIFY_INTEGRATION_PRD.md`, `SHOPIFY_DESIGN_SYSTEM.md`, this implementation plan.

1. Replace obsolete new-store signup steps with the connected existing store.
2. Record exact design tokens, typefaces, layout dimensions, component mappings, and source references.
3. Specify native cart/account boundaries and separate Hotplate ordering.
4. Document domain/contact uncertainty and the first visual review criteria.
5. Check document links, referenced source paths, whitespace, and unchanged source-file hashes.

Acceptance: the next developer can build the theme from the repository without recovering a chat transcript or inventing the design system.

## Milestone B — Unpublished custom theme proof

### Task 3: Establish an isolated theme workspace

Future files: `shopify/README.md`, `shopify/theme/`, `shopify/theme/BASELINE.md` or equivalent metadata kept outside the upload payload.

1. Create a `codex/shopify-theme` branch/worktree without moving or overwriting current uncommitted work. Follow current workspace instructions and verify the destination is appropriate.
2. Re-read the connected store identity and theme inventory. Stop if the store differs from `ku4tbz-mj.myshopify.com`.
3. Inspect actual Horizon `config/settings_schema.json`, layout, header/footer, product/card/cart files; record installed version and file checksums.
4. Verify a supported theme-write path. Existing plugin read access does not prove file mutation permission. Prefer the connected tooling where supported; use Shopify's supported theme tooling only if needed, without adding its packages to the Vercel app.
5. Duplicate the existing Horizon theme as **Sourdough House — design preview**, verify the new ID and unpublished role, then pull/export that duplicate into the isolated theme directory.
6. Preserve a pristine baseline. Put private preview URLs and any credentials outside committed files. Record only nonsecret store/theme identifiers in project metadata.

Acceptance: explicit unpublished target, no modifications to `MAIN`, no theme purchase, no DNS/plan/app changes. If write access is unavailable, complete local work that is useful and report the exact missing permission; do not improvise unsupported endpoints.

### Task 4: Build the shared brand layer

Future files: `shopify/theme/assets/sdh-brand.css`, copied brand SVGs, `shopify/theme/snippets/sdh-brand-lockup.liquid`; targeted modifications to the duplicate's `layout/theme.liquid`, native settings, header/footer sections and section groups.

1. Copy original logo artwork unchanged and preserve accessible labels.
2. Configure DM Sans, DM Serif Display, and Caveat using verified supported font sources; preserve licenses.
3. Add CSS tokens/background/buttons/cards/focus/reduced-motion rules from the design spec, scoped to intended theme elements.
4. Style the native header as the bakery's rounded floating navigation while retaining native commerce controls.
5. Set cross-site links in theme-owned preview settings where possible; avoid changing shared store menus merely for a draft theme.
6. Match footer composition and link to the bakery Contact page until support/social details are verified.
7. Check desktop, mobile, long brand text, breakpoint transitions, keyboard navigation, and 200% zoom.

Acceptance: visible brand match without broken native behavior or source application changes. Do not ship wholesale CSS overrides or a static header that disables native cart/account interactions.

### Task 5: Build the merchandise proof pages

Future files: proposed `shopify/theme/sections/sdh-merch-intro.liquid`, native homepage/collection/product/cart templates and their relevant blocks (use actual downloaded filenames), sample-only blocks if needed.

1. Add editable merchandise intro content and category links for shirts, hoodies, mugs.
2. Style native product cards and collection grid; show correct missing-image/empty states.
3. Style one product-detail layout while retaining native price, media, variant, quantity, and add-to-cart components.
4. Style native cart drawer/page and empty state. Avoid building custom payment or fulfillment logic.
5. Keep samples unmistakably labeled and unable to place orders. Do not publish real products or enable checkout for visual convenience.
6. Preview through the actual unpublished Shopify theme. Record which product/cart behaviors could and could not be exercised with the available sample data.

Acceptance: homepage, collection, product layout, and cart presentation can be reviewed. Visual placeholder acceptance does not count as a successful real product/cart/checkout test.

### Task 6: Verify and present the proof

Evidence location: ignored `.qa/shopify/` for screenshots and logs; concise nonsecret results in `shopify/README.md`.

1. Run the current supported Shopify theme checks and inspect every error/warning relevant to the customization. Confirm schema setting/block IDs are unique within their scopes.
2. Upload only to the recorded unpublished theme. Re-read the role immediately before writing; never pass a live-theme override or publish action.
3. Check rendered Shopify preview at 390px, 1440px, 768–1024px, and zoom. Compare against current bakery output at matched widths.
4. Exercise mobile disclosure, keyboard/escape, links, and any available real-product variant/cart states. Capture both success and unsupported/untested states honestly.
5. Verify the original theme's role and modified-file checksums remain unchanged.
6. Present the actual preview URL and screenshots for owner design feedback. Fix meaningful visual/behavior issues before calling the proof complete.

Decision gate: owner likes the custom Shopify result enough to proceed, requests revisions, or returns to the preserved custom-build alternative. No paid commitment is required to approve the visual direction.

## Milestone C — Store operations (later authorization and business decisions)

### Task 7: Verify trial and operational settings

1. Inspect Settings → Plan and record the actual expiration and any Support update. Do not infer duration from `planName: trial`.
2. Confirm store name, customer support contact, intended sales region/currency, shipping/returns policy, and approved retail prices.
3. Verify available checkout/account branding on the actual plan; list gated features without selecting a paid plan.
4. Decide guest/account experience and test actual customer-account capabilities. Do not build Vercel auth/order pages.

### Task 8: Connect Printful and test a small collection

1. Obtain the owner's explicit go-ahead for Printful connection/configuration and production-order behavior.
2. Verify the correct Printful store, existing templates, usable mockups, and variant/artwork mappings.
3. Sync a small approved assortment through the native integration; preserve exact product/variant IDs and field ownership.
4. Configure real shipping, payment/tax settings, return rules, notifications, and production approval workflow as authorized.
5. Test guest/account purchases, discounts if offered, shipping availability, variant changes, failures, refunds/cancellations, split shipments, and tracking. Keep real paid sample/production actions under explicit spending authorization.

Acceptance: a controlled order proves the configured end-to-end flow; a Shopify test payment must not accidentally submit a paid Printful production order. The owner can identify and resolve fulfillment/billing failures.

## Milestone D — Launch and evaluation

### Task 9: Connect approved domains and public navigation

Future Vercel files: `content/site-content.ts`, navigation tests if needed, and shared link configuration only where justified. DNS and Shopify publication are external changes.

1. Verify root/`www` canonical hostname, intended shop/account hostnames, and current DNS/email records; capture rollback values.
2. Prepare the exact subdomain changes and actual native account-domain configuration for review.
3. After launch approval, connect only the shop/account records, verify TLS, and publish the approved theme.
4. Add the Shop link to bakery header/footer; test bakery → shop → cart/account → bakery navigation. Preserve Hotplate ordering.
5. For Vercel source changes, run `npm run typecheck`, `npm run test`, `npm run build`, and relevant lint; inspect new navigation on mobile. Deploy only when authorized.
6. Validate canonical URLs, customer email links, purchase measurement, consent, and order notifications.

### Task 10: Make the subscription decision from evidence

Compare design satisfaction, owner effort, integration reliability, actual recurring/transaction costs, and ongoing maintenance against the preserved custom plan. Record a decision before the verified trial ends; schedule a reminder only if the owner asks. No automatic plan selection or cancellation is authorized by this document.

## Verification policy

For documentation-only changes, validate source references, links, scope consistency, and preservation of existing work; a full application build is unnecessary. For theme changes, theme checks and actual Shopify rendering are required. For new business logic, use meaningful behavior tests. Do not present a passing build, a mockup, or a successful API upload as evidence of untested fulfillment or trial eligibility.

## Implementation checkpoint — September 6, 2026

- Created the unpublished **Sourdough House - design preview** theme (`139515527253`) from Horizon 4.1.5. Theme write access is now proven.
- Exported 481 baseline files and built/uploaded the branded header, footer, homepage, fonts, original logos, and labeled non-purchasable sample cards. Native cart/account controls are retained.
- Staged exactly one Shop navigation entry, used by both Vercel header and footer. The target subdomain is intended, not yet verified; this change is not deployed.
- Theme Check reports zero findings. Vercel lint and type checking pass. Uploaded text/settings match their local versions.
- Browser review is blocked by the separate Shopify login/password page. Desktop/mobile rendering, product/cart behavior, Settings → Plan expiration, Printful, DNS, and launch remain incomplete.
- Code is preserved on `codex/shopify-theme`; implementation details and validation are in `shopify/README.md` on that branch. The earlier custom-store alternative remains preserved.
