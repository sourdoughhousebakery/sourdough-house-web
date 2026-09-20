# Sourdough House Bakery

Read README.md and the relevant current project ledger before work. Preserve existing unrelated or uncommitted changes.

## Printful merchandise

For bakery merchandise use [sourdough-house-printful](/Users/mattbruce/.codex/skills/sourdough-house-printful/SKILL.md) first. It supplies bakery account/product context, approved garment/mug profiles and presentation preferences, then calls the relevant generic skill: printful-garment-palettes, printful-shopify-sync, or printful-etsy-listings only for an explicitly requested and verified Etsy channel.

Generic skills contain platform methods only and must never name/link this store or another store's companion. Keep bakery-specific values here, in its companion or in docs. Do not import another project's artwork/geometry or authorization. Read the relevant current docs/printful-* and docs/shopify-* ledgers, inspect live identity and reuse existing target products before writes. Historical IDs, prices and approvals are not a substitute for current scope and saved-state verification.

Original pre-split skill files and dated observations are preserved in the September15 migration backup; see docs/printful-skill-architecture.md. This documentation change does not authorize publication, orders or unrelated product changes.

## Account and assigned browser rules — owner clarification September 15, 2026

For every signed-in service used in this project, including Printful, Etsy, Shopify and other project sites, the expected account is **admin@sourdoughhousebakery.com**. Verify live account email plus actual selected store/shop before account-dependent work and report identity before writes. Reuse confirmation already given when target and scope match. Use the connected Chrome extension profile named `sourdoughhousebakery.com` for bakery browser work. This owner-approved assignment supersedes the earlier internal-only rule. Discover the current profile from the browser inventory each task; never hardcode a runtime browser/tab ID or use an arbitrary Chrome profile. Verify the actual provider email and selected store after choosing the profile. If the profile is missing or ambiguous, pause affected browser work and continue local preparation; do not fall back to the internal browser or another profile automatically. Public research and local work do not require sign-in.

Load the configurable store profile in `/Users/mattbruce/.codex/skills/sourdough-house-printful/references/store-context.json`. Explicit one-job store overrides must resolve expected email/channel/store and be verified live; change persistent defaults and these instructions together only on an explicit lasting-switch request. Generic skills receive these values as inputs and never contain store-specific defaults.

Bakery uses its dedicated Chrome profile while TopDogMerch uses the internal browser. These have separate login storage. Tasks within the same Chrome profile still share sessions; separate tabs/tasks do not isolate accounts within that profile. Do not log out, clear cookies, import profiles, switch accounts or take another task’s tabs to repair an account mismatch. Pause the affected provider work while continuing independent local work; establish that conflicting work has paused/finished before any necessary authorized account switch. Verify each API/connector target independently. Follow `/Users/mattbruce/.agents/skills/printful-garment-palettes/references/account-and-browser.md`; these instructions are not a technical browser lock.

Connection verified September 15, 2026: Chrome profile `sourdoughhousebakery.com`; Printful My Account displayed `admin@sourdoughhousebakery.com`, and published products selected store18715291 (UI label My Store). Shopify displayed the same email and Sourdough House Bakery at `ku4tbz-mj`. See `docs/browser-account-verification-2026-09-15.json`. This read-only check does not authorize product changes.

## Supported tools before repetitive browser work — owner requirement September 15, 2026

For product pushes, updates, reconciliation and related work, proactively discover and use available supported APIs, CLIs, MCP/connectors, existing tested scripts and applicable Shopify/platform skills. Choose the best supported route per operation, verify its actual account/store independently, preserve required platform workflow order and authorization, and read back saved results. Use the assigned browser for unsupported operations and required visual placement/storefront checks. Browser assignment is not a requirement to perform every action through browser clicks. Do not switch shared CLI logins, invent API endpoints, or infer publication/installation/credential-creation authority from this preference. Read `/Users/mattbruce/.agents/skills/printful-garment-palettes/references/execution-methods.md`.
