# Custom Merchandise Store Implementation Plan

**Status:** Paused on September 6, 2026 while the owner evaluates a Shopify trial in another thread. This is the retained custom-build option, not authorization to resume development or deploy.

**Goal:** Sell Sourdough House merchandise through this website, with customer accounts, Stripe payments, Printful fulfillment, order tracking, transactional emails, and basic returns/support.

**Architecture:** The existing Next.js website serves the storefront and server endpoints. Supabase owns storefront data, customer authentication, and the durable order ledger; Stripe owns payment processing; Printful owns production and shipment information. Provider events and durable jobs connect these systems without allowing browser input or duplicate callbacks to create production orders.

**Tech stack:** Next.js App Router, React, TypeScript, Tailwind, Supabase Auth/Postgres/Storage, Stripe Checkout, Printful API, transactional email provider to be selected, Vitest and browser verification. A durable job runner and scheduler must be chosen during integration setup.

**Execution method:** When the owner explicitly resumes the custom build, use the writing-plans/executing-plans workflow, tests before business-logic changes, and the isolated worktree. This document gives implementation tasks and acceptance criteria; final SDK calls and provider payloads must follow the current documentation and account capabilities at that time. Do not implement from stale assumptions or treat the local preview as production-ready.

## 1. Workspace and preserved checkpoint

- Canonical project: `/Volumes/Data/Projects/Web/Apps/sourdough-house-bakery`.
- Custom-store worktree: `/Users/mattbruce/.config/superpowers/worktrees/sourdough-house-bakery/merch-store`.
- Branch: `codex/merch-store`; created from `e6ffe5e` on `main`.
- Existing, separate preview branch: `codex/merch-preview`. Selected snapshot/assets and dependency/security changes were copied into the custom worktree; that branch was not merged.
- Custom implementation changes are currently **uncommitted in this worktree**. Preserve them. No push, merge, deployment, live payment, Printful write, or remote database migration has occurred.
- Local preview used `127.0.0.1:3101`. Its process was stopped when implementation was paused. The other development server on port 3100 was not stopped.
- A copy of this plan and the scope proposal is retained in the canonical project's `docs/plans/` for discovery. Future implementation work belongs in the custom worktree; keep plan copies synchronized when resuming.

### What is already implemented locally

| Area | Checkpoint | Limits |
| --- | --- | --- |
| Catalog snapshot | 58 previously reviewed Printful templates grouped into 29 products, with local assets | Snapshot dated September 5; not a current API inventory; several previews are artwork rather than approved product photos |
| Storefront | `/merch`, search, category/collection filters, product detail routes | Local development exposes drafts with a preview notice; production excludes drafts |
| Preview bag | Product/design/color selection, bounded quantities, browser persistence, bag page | No final size mapping, payment, reservation, or order creation; checkout disabled |
| Catalog editing | `/dev/merch` local studio and `/admin/merch` protected editor code | Local studio and save flow were not fully exercised in the browser before pause; authenticated admin integration unverified |
| Source import | Paginated Printful template reader and merge logic preserving storefront name/description/price | Mocked provider responses tested; no real authenticated API import performed; new records need category/design review |
| Storage | Local disk repository with revision checks; Supabase repository and atomic catalog-save migration | Supabase migration not applied/tested against a database; local disk is catalog development storage only |
| Isolation | Separate worktree, environment-variable configuration, loopback-only development studio | No separate Supabase project or provider credentials confirmed |

### Evidence and outstanding verification

- Last full test run: **106 tests passed** after initial catalog, import, persistence, access, and bag work.
- A later bag hydration adjustment addressed the new lint rule using `useSyncExternalStore`. **Lint and production build passed after that change**; the complete test suite was not rerun afterward.
- Production build includes all new routes and TypeScript compilation passed.
- Browser verification: storefront loaded, desktop layout reviewed, search for “Dough Not Disturb” returned two distinct designs. Server returned HTTP 200 for a product detail route. Full product-option, bag, edit/save, reload, mobile, and keyboard walkthroughs remain pending.
- Supabase adapter/SQL, real Printful reads, customer accounts, Stripe, fulfillment, emails, and support flows have not been verified live.
- During preview, the existing contact-content request returned HTTP 503 with missing service configuration. The default Hotplate URL was the generic homepage because this worktree had no `HOTPLATE_CHEF_ID` environment setting. These are local setup gaps to fix before evaluating the complete site; do not change production to compensate.
- Dependencies were copied from the earlier security-updated preview branch. Do not reuse that branch's old clean-audit claim as a current audit; run a fresh audit when resuming.

## 2. Confirmed scope and proposed boundaries

Confirmed: merchandise only; customer registration and sign-in; customer information; shopping/cart; checkout and payment authentication via Stripe; order history/tracking; emails; simple help and return/replacement requests; owner administration; Printful catalog import; independently editable website titles and other storefront content; Supabase storage; secret credentials supplied via environment variables; isolated development.

Hotplate continues to handle all baked-goods orders, payments, pickup schedules, and bakery customer information. No shared cart, shared login, or order-history synchronization with Hotplate is planned.

Proposed v1 boundaries to confirm at restart:

- USD and US shipping, with an explicit allowed-destination policy.
- All merchandise fulfilled by Printful; no bakery pickup for merch.
- Email-link sign-in with an explicit account-creation experience. Email/password is an alternative, with verification and password recovery if chosen.
- Guest checkout with secure guest order access and verified account claiming.
- Stripe-hosted Checkout initially. Customers never need to visit Printful or create a Printful account; hosted Stripe Checkout does mean a payment-page handoff and return to this website. Embedded Stripe Checkout is possible later if remaining on this domain is a firm requirement.
- Owner-reviewed production confirmation for the initial pilot; automate only after fulfillment and fraud handling are proven.
- Return/support requests within the account; actual refunds and Printful claims initially handled through provider dashboards and reconciled back to the website.
- No international shipping, subscriptions, gift cards, discount engine, loyalty program, product personalization editor, live chat, automatic return labels, or automatic exchanges in v1.

## 3. Ownership of information

| Information | System of record | Refresh/edit behavior |
| --- | --- | --- |
| Website title, copy, slug, category, collection, visibility, chosen images | Supabase | Owner edits survive Printful refreshes |
| Retail price and optional variant price overrides | Supabase | Integer cents; no manufacturing-cost substitution; owner approval before changes affect new sales |
| Printful template/store/catalog/variant IDs and artwork configuration | Printful source metadata recorded in Supabase | Import stages changes; stable mapping controls fulfillment |
| Supplier availability and shipping quote | Printful | Refresh and revalidate at checkout; never claim a reservation from a cached snapshot |
| Customer identity/login | Supabase Auth | Verified identity; customer is not a Stripe user |
| Profile and saved addresses | Supabase | Customer edits; existing order snapshots remain unchanged |
| Payment amount, payment/refund/dispute outcome | Stripe | Verified server events and API reconciliation |
| Order number, line items, totals, fulfillment jobs | Supabase | Durable, auditable state; immutable paid-order snapshots |
| Production and shipment events | Printful, plus carrier evidence when available | Update order tracking per package; do not invent delivered status |
| Support conversations, resolutions, internal notes | Supabase | Customer-visible replies separated from private staff notes |
| Card numbers/CVC/payment method credentials | Stripe only | Never stored in Supabase or app logs |

The initial SQL migration stores a complete catalog document in one service-only row with revision-based compare-and-swap. This is a starter implementation for atomic preview edits, **not the final commerce schema**. Before checkout, introduce relational products/variants/orders and preserve stable identifiers when migrating the snapshot.

## 4. Environments and secrets

Use a separate Supabase development project or local Supabase instance with working container infrastructure. No choice or provisioned project was confirmed before pause. Do not copy the live bakery environment wholesale into the worktree.

| Configuration | Purpose | Exposure |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Explicit allowed site/return origin | Public |
| `HOTPLATE_CHEF_ID` | Existing bakery handoff | Nonsecret |
| `ADMIN_EMAILS` | Explicit administrator allowlist | Server configuration |
| `MERCH_DATA_SOURCE` | Local catalog versus Supabase repository | Server configuration |
| `MERCH_SUPABASE_URL`, `MERCH_SUPABASE_SECRET_KEY` | Isolated merch database | Secret key server-only |
| Supabase URL/publishable key for customer auth | Browser/server auth against the chosen merch project | Publishable key is intentionally public; name consistently after auth design is settled |
| `PRINTFUL_READ_TOKEN` | Narrow read access for catalog discovery | Server-only secret |
| Separate Printful fulfillment credential/store ID | Order draft and confirmation operations | Server-only, least privilege |
| Stripe secret key and webhook signing secret | Test payment/session/event verification | Server-only secrets; distinct test/live configuration |
| Stripe publishable key, if required by chosen UI | Supported Stripe browser UI | Public key only |
| Email API credential and sender settings | Transactional email | Credential server-only |
| Job-runner/webhook credentials | Trusted execution and event authentication | Server-only secrets |

Keep actual secrets in the local process or ignored environment file and the deployment platform's secret settings. Commit placeholders only. Never print credentials, raw provider bodies, full customer addresses, payment client secrets, or auth tokens. A browser-exposed environment variable must never contain a server credential.

The local studio intentionally requires development mode, explicit opt-in, an exact loopback host, same-origin writes, and disk storage. It is for non-sensitive catalog preview editing only. It must not become a production auth bypass, touch customer/order records, or write to a remote Supabase project.

## 5. Task-by-task implementation roadmap

Every task follows: write focused failing behavior tests; implement the smallest complete change; run the focused tests; review the result; commit a coherent local checkpoint. Run the wider suite at integration boundaries rather than repeatedly without changes. Provider-dependent tasks require a real development-system check before being marked complete.

### Task 0 — Resume and close out the initial preview

**Files:** existing `components/merch/`, `lib/merch/`, `app/merch/`, `app/dev/merch/`, `app/api/dev/merch/`, `.env.example`, `SECURITY.md`.

1. Inspect both worktree and main status, this plan, and current project instructions; preserve all existing edits.
2. Install from the lockfile, run tests/lint/typecheck/build and a fresh dependency audit.
3. Configure only nonsecret local settings and start the preview on a free port, preferably 3101.
4. Browser-test filter combinations, detail navigation, template/color changes, bag add/update/remove/reload, and empty/error states.
5. Test local studio save/reload/title/price/visibility changes and stale-revision rejection. Restore test edits after verification.
6. Check narrow phone layout, keyboard navigation, focus, image descriptions, and disabled checkout messaging.
7. Review unfinished bag edge cases: malformed browser storage, duplicate selections, storage unavailable, and missing source variants. Do not label this a checkout cart yet.
8. Record a local checkpoint commit after review; no merge or push.

**Exit:** a demonstrably working catalog preview, clean verification record, and no claim of connected commerce.

### Task 1 — Prove development service access

**Files:** `.env.example`, `lib/printful/`, `lib/merch/repository.ts`, new `docs/merch-development.md`.

1. Confirm or provision the isolated Supabase environment and select an auth project. Decide whether merch and existing bakery admin identities use the same development auth project or explicit separate clients.
2. Verify direct API access to the sister's Stripe account; an account used through another platform may not provide the integration access assumed here.
3. Verify Printful token scopes, store context, template reads, product/variant detail reads, and the account's testing capabilities.
4. Select the transactional email provider and durable job runner; confirm support for retries, concurrency, and scheduled reconciliation.
5. Prove one representative design/color/size mapping in Printful. Current docs describe both synced store variants and template-plus-catalog-variant ordering; choose the supported mapping only after account-level verification. Avoid unnecessary product republishing if a verified template mapping suffices.
6. Exercise shipping quotes with a synthetic development address using the intended product mapping. Do not create production orders.

**Exit:** one documented valid item mapping, test Stripe API access, functioning isolated database, and selected email/job infrastructure. Record blockers rather than substituting production credentials.

### Task 2 — Establish the durable commerce schema

**Files:** `supabase/migrations/20260906123621_merch_catalog.sql` (existing, unapplied); additional migrations generated with the installed Supabase CLI; planned `lib/merch/data/` and database integration tests.

Create relational tables for:

- `merch_products`: stable ID/slug, storefront fields, visibility, image approval, timestamps, revision.
- `merch_product_sources`: product mapping to Printful templates/store products, source version, import run, missing/review flags.
- `merch_variants`: valid size/color/capacity combination, exact fulfillment mapping, price, enabled/review status.
- `merch_import_runs`: progress, counts, sanitized failures, completion timestamp.
- `customer_profiles` and `customer_addresses`: owner ID and editable personal information.
- `merch_orders`: owner or guest reference, human order number, currency/totals, separate states, provider IDs, timestamps.
- `merch_order_items`: immutable product/variant/artwork/price/quantity snapshots.
- `merch_shipments` and shipment items: package-level tracking and quantities.
- `merch_provider_events`: unique provider event identity, processing outcome, minimal retained event data.
- `merch_jobs`: durable fulfillment/email/reconciliation work with unique business keys, leases, retries, and terminal errors.
- `merch_support_requests`, `merch_support_messages`, and private staff notes.
- `merch_order_events` and settings: audit history, operational pause flags, pilot limits.

1. Define foreign keys, uniqueness constraints, integer money/quantity checks, immutable order references, and indexes around actual access patterns.
2. Separate customer-visible data from service-only provider mappings and internal operational records.
3. Enable RLS on exposed tables and grant only the required privileges. Customers may access only their own profiles, addresses, orders, and support content; payment/fulfillment state is server-owned.
4. Use trusted admin authorization; never trust user-editable profile metadata to grant roles.
5. Migrate the starter snapshot without overwriting curated fields or losing source IDs.
6. Test access with anonymous, customer A, customer B, admin, and service clients. Execute migrations on development and test backup/restore.

**Exit:** schema applied and permission-tested in development; no local JSON or browser storage used as an order ledger.

### Task 3 — Finish Printful import and review

**Files:** extend `lib/printful/templates.ts`, `lib/merch/store.ts`; add store-product/catalog adapters; extend `components/merch/studio.tsx`, `app/api/admin/merch/`, and import tests.

1. Read all pages, validate payload shapes, enforce timeouts/limits, and handle rate limits with bounded backoff.
2. Stage full imports before applying changes. Preserve the last good catalog on failure, incomplete pagination, or concurrent edits; avoid treating a temporary empty response as permission to disable everything without review.
3. Resolve category/model and actual variant combinations through provider detail data. Do not cross-product independent colors and sizes.
4. Preserve edited website name/copy/price/category/visibility. Record source titles separately. Add image selection and curated gallery editing.
5. Group light/dark configurations intentionally while preserving the corresponding artwork; flag ambiguous matches instead of silently merging.
6. Review and approve mockups; source template previews may not be valid retail images. Validate external asset hosts/content before download or optimization.
7. Mark removed/changed configurations for review and block only the affected variants from checkout. Preserve historical orders.
8. Add a publish checklist: valid retail prices, images, sellable variants, shipping policy, support policy, and provider mapping.
9. Move long imports to the durable runner with progress/status; avoid a synchronous request timing out partway through a large catalog.

**Exit:** real import of the accessible collection, repeat import without duplicates or lost edits, and at least one product ready for a controlled test purchase.

### Task 4 — Customer accounts and profiles

**Files:** planned `app/account/`, `app/auth/`, `lib/customer-auth/`, `components/account/`, and dedicated auth/data tests.

1. Implement account creation, verified email sign-in, sign-out, expired-link recovery, and safe redirects. If password-based auth is selected, add password reset and verification flows.
2. Use current Supabase SSR/session guidance; configure explicit development and production callback origins.
3. Add editable name/contact details and saved shipping addresses. Verify ownership server-side for every write.
4. Keep address snapshots on placed orders immutable; route post-order address changes into support review.
5. Add account navigation and empty/loading/error states for order history.
6. Define guest purchase claiming: verify email ownership and claim eligibility, never match ownership using an arbitrary browser email field alone.
7. Rate-limit auth/claim flows, avoid account enumeration, and test session expiry and cross-user isolation.

**Exit:** two real development accounts can independently register, sign in, edit profiles, and see only their own data.

### Task 5 — Replace the preview bag with a checkout-ready cart

**Files:** replace/extend `lib/merch/bag.ts`, `components/merch/bag.tsx`, `components/merch/product-detail.tsx`; planned `lib/merch/cart.ts`, `app/api/merch/cart/` and pricing tests.

1. Require an enabled, exact size/color/capacity variant before adding to cart. Distinguish preview choices from purchasable selections.
2. Persist only identifiers and quantities client-side. Reconstruct prices and mappings server-side on every quote/checkout request.
3. Validate quantity limits, duplicates, discontinued variants, currency, and changed prices. Present changes to the customer before payment.
4. Collect/validate destination, get a server-side shipping quote, set expiration and a cart/address fingerprint.
5. Integrate the owner's confirmed tax setup; include shipping/tax in an explicit final amount.
6. Requote when cart or address changes. With hosted Stripe Checkout, either bind the precollected destination consistently or choose a supported shipping approach; do not assume a fixed shipping amount automatically follows an address changed inside Checkout.

**Exit:** tampered prices and arbitrary provider IDs cannot affect server totals or fulfillment mapping, and the customer sees accurate final pricing.

### Task 6 — Stripe checkout and the order ledger

**Files:** planned `lib/stripe/`, `lib/merch/orders/`, `app/api/merch/checkout/route.ts`, `app/api/webhooks/stripe/route.ts`, confirmation/status pages and tests.

1. Install a current supported Stripe SDK and pin it in the lockfile.
2. Persist a pending order and frozen line/price/address snapshot before creating a Checkout Session. Use stable idempotency keys for checkout retries.
3. Bind session, order, customer/guest, currency, amount, and environment. Construct return URLs from trusted configuration.
4. Use Stripe's supported payment UI and payment authentication. No customer Stripe account is required.
5. Verify raw webhook signatures, endpoint secret, relevant event types, environment/account binding, and event timing requirements.
6. Retrieve/reconcile payment state and saved totals before changing an order to paid; handle async payments explicitly if enabled.
7. Transactionally record payment state and enqueue fulfillment/email work. A browser success URL cannot mark anything paid.
8. Handle cancellation, expiry, failed payment, late events, duplicate callbacks, and two distinct events for one payment.
9. Add refund/dispute event handling and a fraud/manual-review hold; payment success alone is not clearance to produce.

**Exit:** Stripe test purchases create exactly one durable order and job; forged, unpaid, wrong-environment, and mismatched events cannot advance fulfillment.

### Task 7 — Printful production and tracking

**Files:** planned `lib/printful/orders.ts`, `lib/printful/shipping.ts`, `lib/merch/jobs/`, Printful callback endpoint, worker entrypoints and reconciliation tests.

1. Consume trusted fulfillment jobs using a persisted claim/lease. Recheck payment, cancellation, refund, dispute, fraud hold, and pause settings before provider writes.
2. Build the provider payload exclusively from the saved, verified order snapshot.
3. Create a Printful draft with a stable external reference; record provider ID before confirming production.
4. On timeout or ambiguous response, query/reconcile before creating another order. Verify actual provider idempotency behavior rather than assuming an external ID guarantees it.
5. Initially require authorized owner approval to confirm production. Keep test Stripe flows unable to confirm production even if a live Printful credential is accidentally configured.
6. Receive provider events using its verified authentication mechanism; fetch authoritative order/shipment state when events cannot be sufficiently trusted alone.
7. Track split packages and their item quantities; show carrier links. Mark delivered only with supporting provider/carrier evidence.
8. Schedule reconciliation for missing events and stale states. Escalate invalid address, unavailable item, insufficient billing funds, rejected files, and repeated failures to the owner.

**Exit:** a controlled draft demonstrates the correct design/options/destination. A real charged/produced sample is a separate explicitly authorized step before launch.

### Task 8 — Order history and owner operations

**Files:** planned `app/account/orders/`, `app/admin/merch/orders/`, order detail components, server query/command handlers.

1. Render order number/date/items/totals, separate payment and production statuses, shipping address, and package tracking.
2. Provide secure guest status access using a scoped unguessable credential; keep PII out of query strings and referrers.
3. Add owner filters for new/held/failed/in-production/shipped/refunded orders, with sanitized provider references.
4. Support explicit approve/retry/hold actions with authorization, CSRF protection, audit history, and transactional state validation.
5. Link to provider dashboards for v1 refunds/cancellations; reconcile actual provider outcomes back into the ledger.
6. Add pause controls for new checkout and production confirmation without blocking access to existing orders.

**Exit:** the owner can diagnose a failed paid order and recover it without duplicate production; customers see an accurate history with no cross-account access.

### Task 9 — Transactional emails

**Files:** planned `lib/email/`, `emails/`, email job handlers, templates and delivery-event handling.

1. Verify the sender domain and configure sender/reply-to identities in development and production.
2. Build account-access, order confirmation, shipment, support-request acknowledgment, staff-reply, and refund/update templates.
3. Trigger each message from an authoritative saved state transition with a unique delivery key. Retry sending without repeating fulfillment.
4. Include a plain-text alternative, mobile-friendly layout, accessible links, order reference, and direct account/support destination.
5. Handle bounces/delivery failures and alert the owner when critical messages fail repeatedly.
6. Decide whether Stripe supplies the payment receipt or the application does, avoiding confusing duplicate messages. Keep marketing consent separate.

**Exit:** each tested lifecycle transition produces one correct email, and email failure cannot lose or duplicate an order.

### Task 10 — Basic returns and customer service

**Files:** planned `app/merch/help/`, `app/account/orders/[id]/help/`, `app/admin/merch/support/`, support commands and notification tests.

1. Publish owner-approved shipping, returns/replacement, contact, and response-time information. Do not promise provider eligibility before verifying it.
2. Add an order-linked request with item/reason/message and visible status. Begin with text; secure photo attachments can follow if necessary.
3. Restrict requests and message reads/writes to the order owner or verified guest. Rate-limit submissions.
4. Give admins a simple inbox with replies, private notes, and resolution status; notify customers by email.
5. Distinguish approved return, refund pending, refund confirmed, replacement pending, and resolved outcomes as applicable.
6. Record the agreed return address/instructions only after review. A Stripe refund does not cancel Printful production; a Printful claim does not necessarily refund the customer.

**Exit:** a customer can submit and follow a request and receive a reply; private notes and other customers' information remain inaccessible.

### Task 11 — Production readiness and controlled release

**Files:** deployment configuration, `SECURITY.md`, `docs/merch-operations.md`, integration tests and launch checklist.

1. Complete server-side validation, strict admin authorization, rate controls, CSRF checks, secure cookies, and the CSP compatible with the chosen Stripe UI.
2. Exercise duplicate/concurrent events, process crashes, stale job leases, network failures, lost callbacks, invalid addresses, partial refunds, disputes, and split shipments.
3. Run database permission tests and restore a backup. Confirm retention/export/deletion behavior and private storage rules.
4. Test alerts, reconciliation, order/production pause switches, and the support escalation path.
5. Verify mobile/desktop/keyboard flows and the existing Hotplate handoff. Recheck dependencies and production environment configuration.
6. Obtain authorization for a real sample order and verify the received design, garment/options, shipping, customer emails, and provider charges.
7. Walk the owner through everyday tasks, failures, refunds, and support. Confirm operational ownership and acceptable maintenance cost.
8. Release a small approved collection under defined pilot limits, with rollback and monitoring. Merge/deploy only when the owner requests the release.

**Exit:** verified end-to-end commerce and owner readiness, not merely passing unit tests or a successful build.

## 6. State and recovery rules

Keep these separate rather than using a single ambiguous “order status” field:

| State family | Illustrative states | Critical rule |
| --- | --- | --- |
| Payment | pending, paid, failed, partially_refunded, refunded, disputed | Only verified Stripe evidence changes financial state |
| Fulfillment | not_submitted, queued, draft, awaiting_review, submitted, in_production, partially_shipped, shipped, failed, canceled | A paid order can remain held or failed; retry cannot bypass a hold |
| Review | clear, needs_review, fraud_hold | Approval is authorized and auditable |
| Shipment | created, shipped, delivered, exception | Track each package; delivered needs evidence |
| Support | open, waiting_on_customer, waiting_on_bakery, resolved | Support resolution does not imply money was refunded |

Use unique constraints on provider event IDs, Stripe session/payment identities, job business keys, and provider order references as appropriate. Concurrency/crash tests must prove the transitions and recovery paths. Minimize stored provider payloads and avoid logging personal data.

## 7. Working estimate and cost model

The previous **14–25 focused working days / roughly 3–6 calendar weeks** remains a preliminary estimate for a narrowly scoped first release with working accounts/credentials, a small launch collection, and normal provider behavior. It is not a fixed quote, a guaranteed remaining duration, or a claim that the prototype completes a large fraction of the integration work.

Re-estimate after Task 1. A custom job runner, difficult template mapping, unusable mockups, complex tax/shipping requirements, or production-grade operational hardening beyond the initial assumptions can materially extend it. Physical sample delivery also adds calendar time. AI reduces some coding effort but not business decisions, account access, or external verification.

The proposal's $45–$80/month baseline is only an illustrative low-volume allowance for hosting/database/email. Obtain current prices before deciding; include job infrastructure, monitoring, extra development projects, backups, tax tools, payment processing, manufacturing/shipping, domain, AI tools, and human maintenance. Existing paid plans may cover part of the baseline. No plan/account subscription has been purchased here.

## 8. Shopify comparison without discarding this work

The Shopify trial is evaluated elsewhere; this plan does not assume its outcome or current account capabilities.

Use the same representative merch product and evaluate:

- Time to import/publish correct Printful designs and variants with usable images.
- Customer account, order history, shipping, tax, payment, and email experience.
- Owner effort for product edits, failed orders, returns, and support.
- Total platform/app/processing cost and restrictions for the chosen setup.
- How browsing and checkout fit the existing bakery site.
- Who maintains software and resolves integration problems.

Reusable if Shopify is chosen: reviewed product groupings, copy, image assets, retail-pricing decisions, support policies, and the bakery site's merch design. Printful/account/order adapters and checkout state machines are implementation-specific; do not assume they port unchanged. Confirm supported export/import and customer migration options before promising portability. Keep one authoritative system for orders and fulfillment; never leave Shopify and custom workers both submitting the same purchase.

## 9. Restart checklist

1. Ask which direction won the trial only when the owner returns to this work; do not continue development while paused.
2. Open the `merch-store` worktree and inspect uncommitted changes before running generators or changing branches.
3. Read this plan, the proposal, and current instructions. The proposal gives scope; this document gives the implementation checkpoint and sequence.
4. Confirm auth/database isolation, Printful/Stripe access, sender domain, US shipping policy, and owner responsibility for production review/support.
5. Complete Task 0 verification, then Task 1 integration proof, and revise the estimate based on evidence.
6. Reconcile concurrent site changes only after reviewing them; do not overwrite active main or preview work.
7. Update both plan copies after the next checkpoint.

Local restart command, using the reserved separate port after checking it is free:

```sh
cd /Users/mattbruce/.config/superpowers/worktrees/sourdough-house-bakery/merch-store
npm ci
MERCH_LOCAL_STUDIO=1 MERCH_STUDIO_ORIGIN=http://127.0.0.1:3101 HOTPLATE_CHEF_ID=sourdoughhouse43 NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3101 npm run dev -- --hostname 127.0.0.1 --port 3101
```

Then inspect `/merch`, `/merch/bag`, and `/dev/merch`. No secret credentials are needed for this local preview. Restarting it does not connect Stripe, send Printful orders, or apply Supabase migrations.

## 10. References to revalidate when resuming

- [Scope proposal](2026-09-06-custom-merch-store-proposal.md).
- [Printful API documentation](https://developers.printful.com/docs/): template/catalog/store identifiers, shipping, orders, events, and actual account capabilities.
- [Printful manual/API stores](https://help.printful.com/hc/en-us/articles/23581702148764-How-do-I-create-and-use-a-manual-order-API-store).
- [Printful billing](https://help.printful.com/hc/en-us/articles/360014007680-How-does-the-Printful-billing-system-work).
- [Stripe checkout fulfillment](https://docs.stripe.com/checkout/fulfillment) and [webhooks](https://docs.stripe.com/webhooks).
- [Supabase row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security) and current SSR/Auth documentation.
- Installed Next.js guides under `node_modules/next/dist/docs/`.

All provider-dependent behavior must be checked against current documentation and the actual development accounts at restart. No full SDK implementation or deployment is implied by this document.
