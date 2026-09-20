# Custom merchandise store proposal

Date: September 6, 2026. Status: custom-store option retained; implementation paused while the owner evaluates Shopify in another thread. An initial catalog prototype exists only in the isolated `codex/merch-store` worktree. No production commerce is enabled.

See the [detailed implementation plan and resume checkpoint](2026-09-06-custom-merch-store-implementation.md) for completed work, remaining tasks, verification limits, and restart instructions. That checkpoint supersedes the original pre-implementation assumptions below.

Confirmed user clarification: the requested Shopify-like essentials are merchandise shopping, account creation, returning customer sign-in, customer information, order history/tracking, and Stripe checkout/payment processing. Full Shopify feature parity is not the objective.

Additional clarification: keep this a basic store and include returns and customer-service information. Provide a lightweight order-linked help/return request workflow, not a full help-desk platform.

## Scope and recommendation

Build a merchandise store inside the existing bakery website using Stripe for payments and Printful for fulfillment. Hotplate continues to own all baked-goods orders, payments, pickup scheduling, and customer records. Merchandise accounts show merchandise orders only; there is no shared bakery/merch cart or Hotplate account synchronization.

A custom store is feasible for this scope. AI can accelerate development, but the payment-to-fulfillment integration and operational testing still need deliberate engineering. Recommend the custom route if the owner is comfortable maintaining the integration and handling customer support.

Options considered:

| Approach | Benefit | Tradeoff |
| --- | --- | --- |
| Custom storefront + Stripe + Printful API — recommended for the requested experience | Fits this website; owns customer accounts and order history | We maintain checkout, fulfillment synchronization, and failure recovery |
| Custom storefront + Stripe + manually entered Printful orders | Smaller initial automation scope; workable pilot | Someone must transfer orders and tracking; error-prone as sales grow |
| Website catalog linked to an established commerce platform | Less custom operational software | Extra platform setup/cost and a separate commerce system |

## Existing foundation

Inspected repository: Next.js App Router, React, TypeScript, Supabase client/server helpers, authenticated admin routes, catalog editing, and Vercel deployment documentation. There is no Stripe dependency or merchandise order system in the inspected code. Existing Supabase integration is useful groundwork; production configuration and permissions have not been audited in this planning pass.

The retained September 5 snapshot contains 58 Printful templates grouped into 29 products. The local prototype reuses available garment previews and artwork, with missing/unfinished imagery labeled. The September 5 merch discovery document records the earlier audit. Those are not 58 finished retail listings. Saleable product mapping, approved images, prices, and valid variants remain work. That document also records unresolved mockup generation and missing thumbnails; this plan does not claim those issues have since been fixed.

## Proposed first release

- `/merch`: product collection with category filters and approved mockups.
- `/merch/[slug]`: product description, size guide, valid color/size/capacity choices, price, availability, and shipping information.
- Merchandise cart with quantities and final server-validated totals.
- Stripe-hosted Checkout initially, returning to an order confirmation page on this website. Embedded Checkout is an optional later presentation choice.
- Explicit account creation, returning customer sign-in, sign-out, and account recovery. Recommend email-link authentication initially; email/password can be substituted if preferred, including password reset and email verification.
- Customer profile with editable name and contact information, saved shipping addresses, merchandise order history, and order details. Profile edits must not silently change an already placed order's shipping address.
- Guest checkout as a convenience alongside accounts, with a verified path to associate purchases with an account later.
- Shipment tracking links and per-package details for split shipments. Show delivered only when the upstream information supports it; otherwise show shipped with a carrier link.
- Admin merchandise catalog controls and order list with payment status, fulfillment status, exception details, and links to Stripe/Printful records.
- Confirmation and shipment emails through a transactional email provider. Keep marketing subscriptions separate.
- Customer-service page with contact details, shipping guidance, return/replacement policy, and expected response time set by the owner.
- Order-linked help and return/replacement requests: customer selects an item and reason, submits a message, and sees responses and request status. Admin can review, reply, and mark requests open, waiting, approved, declined, or resolved; notify the customer by email. Requests require authenticated ownership or secure guest access and basic spam/rate controls.
- Returns remain owner-reviewed. Do not promise automatic eligibility, prepaid labels, or automatic refunds. Record approved remedies and any provider references; the owner handles actual Stripe refunds and Printful claims/cancellations in their dashboards initially. Resolve the policy and return destination before launch; do not assume items should be sent to Printful.

Planning assumptions: Printful fulfills all merch; start with a small approved collection, USD, and US shipping. These are proposed boundaries, not confirmed business decisions. No subscriptions, loyalty system, international shipping, personalization editor, or self-service exchanges in the first release. Customers contact the bakery for support; admins initially use Stripe and Printful dashboards for refunds/cancellations.

## How the systems connect

### Printful catalog import and refresh

Include an admin **Import / Refresh from Printful** action in the first release. It should discover all of the bakery's accessible saved products/templates across all result pages, import them as drafts, and report imported, updated, unchanged, and needs-attention counts. Importing the entire collection does not require publishing the entire collection at launch.

- Retrieve source IDs, product types, supported options, artwork mappings, and available images/descriptions using the appropriate template, store-product, and catalog endpoints. Verify the exact fields and account scopes in the integration proof. Missing mockups or descriptions must be surfaced for completion rather than assumed available.
- Distinguish saved design templates from orderable store products. Establish saleable products/variants in the Printful API store, or another verified order mapping, before enabling checkout. Template IDs alone are not a fulfillment mapping. Printful documents these separate resources in its [API documentation](https://developers.printful.com/docs/).
- Review imported listings in the website admin: set retail prices, choose approved images, adjust customer-facing copy, and publish selected items. Import verified existing retail prices where available; never substitute Printful production costs for selling prices.
- Group matching light/dark template configurations into one customer-facing product only when their design and garment match, preserving the exact artwork for every option. Do not generate unsupported color/size combinations.
- Match refreshes by stable source IDs so repeated imports do not duplicate products. Preserve website-owned retail prices, edited copy, and visibility. Stage material artwork/option changes for review. Once products are published, use the orderable store-product configuration as the fulfillment source rather than assuming template edits propagate to it.
- Keep the last successful catalog if an import fails. Show last refresh and per-item errors. Removed/unavailable variants become unavailable for new purchases without deleting historical order information. Revalidate at checkout; a catalog refresh is not a stock guarantee.
- Start with on-demand admin refresh. Scheduled refresh can follow once field ownership and actual provider behavior are verified.

Acceptance: import all accessible bakery items, rerun without duplicates, preserve local edits, flag missing imagery/prices/mappings, and prove each enabled option maps to the intended Printful product and design. The existing 58-template audit is a starting inventory, not a verified current import count.

### Purchase and fulfillment flow

1. The website displays approved merchandise products from its database, including exact Printful variant/artwork mappings and retail prices stored as integer cents.
2. The server validates selected variants, quantity, availability, shipping destination, and price. Obtain a Printful shipping quote before creating checkout, or adopt an owner-approved flat-rate policy after checking margins. A changed address/cart requires a valid revised quote; Stripe must not charge using a stale shipping assumption.
3. Save a pending order with an immutable snapshot of items, prices, shipping, tax, and destination. Create its Stripe Checkout Session with a stable order reference.
4. A verified Stripe webhook confirms payment. Never treat a browser success page as proof of payment. Handle expired sessions and payment failures; initially restrict payment methods to the supported flow or explicitly handle delayed payment results.
5. Persist a fulfillment job and submit the paid order to Printful. Use stable external references, uniqueness constraints, and retry protection. After an ambiguous API timeout, look up the existing order before submitting another one. Keep draft creation and production confirmation explicit.
6. Printful updates feed the website's shipment and fulfillment records. Use authenticated/validated webhook handling as supported by the provider, with periodic API reconciliation to recover missed updates. Email failures retry independently of production submission.
7. Errors such as an unavailable variant, invalid address, or Printful billing failure appear in an admin attention queue. The customer sees an accurate status while the owner resolves or refunds the order.

Stripe specifically requires webhook-based fulfillment and protection against duplicate fulfillment: [Stripe fulfillment guide](https://docs.stripe.com/checkout/fulfillment). Printful supports custom integrations through its [API](https://www.printful.com/site/api) and [manual/API stores](https://help.printful.com/hc/en-us/articles/23581702148764-How-do-I-create-and-use-a-manual-order-API-store). Verify actual account permissions and endpoint contracts during the first phase.

## Data and account responsibilities

Proposed separate merch tables: products, variants, customer profiles, orders, order items, shipments, support requests/messages, provider events, and fulfillment/email jobs. Orders link to Stripe and Printful IDs. Support requests link to orders and their owners, with internal notes kept separate from customer-visible replies. Keep payment, refund, and fulfillment states separate: a refunded order does not automatically mean production was canceled.

Reuse Supabase authentication, with separate customer and admin permissions. Customers may read only their own orders; guests get secure, limited order access. Link guest purchases to an account only after verified ownership, never from an email value submitted by a browser. Payment changes and fulfillment actions run on the server. Store no card numbers. Add retention/deletion procedures that preserve required business records and minimize retained personal data.

Customer sign-in is website authentication; customers do not need a Stripe account. Stripe Checkout handles payment information and payment authentication challenges where required. The server creates checkout sessions and verifies webhook signatures using the bakery's Stripe credentials. Reusing the sister's Stripe account is the intended setup, subject to confirming direct API access. Saved payment methods are optional later work and would remain in Stripe rather than in our database.

Recommended code boundaries: `app/merch/`, `app/account/`, `app/admin/merch/`, `app/api/merch/`, dedicated Stripe and Printful webhook routes, and separate `lib/merch/`, `lib/stripe/`, and `lib/printful/` modules. Extend database migrations and `.env.example`; keep credentials server-side.

## Delivery phases and effort

These are planning estimates for one experienced developer using AI, including integration and verification. They are not a quote or a promised calendar schedule.

| Phase | Deliverable and completion gate | Estimated effort |
| --- | --- | --- |
| 1. Integration proof and business rules | Verify direct Stripe API access, Printful API store/products, one valid fulfillment mapping, shipping approach, retail margin, and account permissions | 1–2 working days |
| 2. Merch catalog, import, and cart | Paginated Printful import/refresh into drafts, preserved local edits, approved collection, usable images, correct options, server-owned prices, mobile shopping flow | 3–6 days |
| 3. Payments and order records | Stripe test checkout, durable orders, signed webhooks, failure/expiry handling, shipping and tax configuration | 2–3 days |
| 4. Customer accounts | Account creation/login/recovery, profile and saved addresses, guest access, verified account linking, isolated order history and details | 2–3 days |
| 5. Fulfillment and tracking | Paid-order submission, duplicate protection, retries, shipment synchronization, email and admin exception queue | 3–5 days |
| 6. Basic customer service and returns | Policy/contact pages, order-linked requests, admin replies, status, and email notifications | 1–2 days |
| 7. Launch verification | Privacy/access checks, payment and provider failure scenarios, mobile/accessibility review, owner walkthrough, controlled real sample order | 2–4 days |

Total: approximately 14–25 focused working days, or 3–6 calendar weeks allowing for normal review and setup, including the basic returns/support workflow and full catalog import/refresh. Product/image repair, owner response time, provider account issues, and physical sample shipping may extend the calendar. A catalog preview can arrive much earlier than a production-ready store.

## Costs and operations

Budget roughly $45–$80/month for low-volume hosting, database, and transactional email, excluding development, AI subscriptions, domain, usage overages, tax tooling, payment processing, and Printful orders. This is an estimated operating allowance, not a vendor bundle or a confirmed incremental bill. Existing paid plans may already cover part of it.

- Vercel Pro is listed from $20/month; verify existing plan and usage. Hobby is for personal, non-commercial use. Sources: [Vercel pricing](https://vercel.com/pricing), [Hobby plan](https://vercel.com/docs/plans/hobby).
- Supabase Pro starts at $25/month; account/project configuration and usage affect the bill. Source: [Supabase pricing](https://supabase.com/pricing).
- Stripe standard US domestic card pricing is generally 2.9% + 30 cents; verify the sister's actual account pricing and additional services. Source: [Stripe pricing](https://stripe.com/pricing).
- Printful charges production and shipping separately from the customer's payment to the store. Maintain a working billing method and enough funds to cover fulfillment before Stripe payouts arrive. Source: [Printful billing](https://help.printful.com/hc/en-us/articles/360014007680-How-does-the-Printful-billing-system-work).

Price products using retail revenue minus manufacturing, shipping subsidy, processing, applicable provider charges, and allowance for support/replacements. Configure sales-tax collection from the owner's confirmed requirements; software configuration does not establish registration or filing obligations.

Someone must own failed orders, refunds, delivery questions, product availability changes, dependency updates, and alert review. Reserve a few hours monthly as an initial maintenance allowance, with extra time for incidents; this is an estimate. Add error monitoring, durable retries, order reconciliation, database backups and a restore procedure, plus a switch that disables new merch checkouts while retaining account/order access.

## Acceptance checks before launch

- Correct artwork and physical variant for every enabled listing; sample order verifies the production result.
- Complete guest and signed-in test purchases with correct line totals and shipping.
- Tampered browser prices cannot change the charged amount.
- Duplicate or reordered events never create duplicate paid orders or Printful production jobs.
- A payment succeeding while Printful is unavailable remains visible and recoverable.
- Lost callbacks, expired checkout, partial refunds, cancellation timing, and split shipments have defined behavior.
- Customers cannot access another customer's order by guessing its URL or ID.
- Customers can submit and follow a help/return request only for their own order; admin-only notes never appear in customer responses. An approved return request does not display as refunded until the payment refund is confirmed.
- Failed emails retry without resubmitting fulfillment.
- Production secrets remain private; staging uses test Stripe credentials and prevents accidental Printful production confirmation. Verify Printful testing capabilities rather than assuming Stripe-like sandbox behavior.
- Existing Hotplate baked-goods navigation and order handoff still work.
- Run repository tests, typecheck, build, and relevant lint; document unrelated existing lint failures. Review desktop/mobile and keyboard use.
- Owner can find and resolve a failed order and understands that a Stripe refund does not itself cancel Printful production.

## Decisions to settle during phase 1

Confirm the first collection and prices, approved mockups, US shipping scope and rates, returns/replacement policy, support email, tax setup, and whether Printful production should auto-confirm after payment or require initial owner review. Confirm the existing Stripe account permits direct API integration rather than assuming platform-managed payment access is sufficient.

Recommended next milestone: prove one representative product from verified Printful variant through a Stripe test payment to a controlled fulfillment draft, then finalize the implementation breakdown around that evidence.
