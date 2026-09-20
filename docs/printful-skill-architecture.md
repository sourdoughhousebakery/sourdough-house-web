# Printful skill architecture

Updated September 15, 2026 at the owner's request. Start with [Sourdough House Printful](/Users/mattbruce/.codex/skills/sourdough-house-printful/SKILL.md) for bakery merchandise. Its garment and mug reference records were moved byte-for-byte from formerly generic skills; the bakery's approved settings were not changed.

The generic operation skills remain at their existing paths:

- [Printful Garment Palettes](/Users/mattbruce/.agents/skills/printful-garment-palettes/SKILL.md): artwork/color compatibility, file checks and requested mockup presentation.
- [Printful Shopify Sync](/Users/mattbruce/.codex/skills/printful-shopify-sync/SKILL.md): Shopify product/variant/media/fulfillment mapping and verification.
- [Printful Etsy Listings](/Users/mattbruce/.codex/skills/printful-etsy-listings/SKILL.md): Etsy-connected apparel setup, repair and photo mapping, only when that channel is requested and verified.

Dependencies go one way: store companion → generic skill. Generic skills do not know store names, saved settings or companion locations. Store-neutral methods accept the current task's target, artwork, physical variants, prices, presentation, authorization and final status. Existing historic docs that mention bakery references inside a generic skill describe the former layout; use the new companion for those records.

All original skills are backed up at `/Volumes/Data/Projects/Other/TopDogMerch/archive/skill-backups/store-neutral-printful-2026-09-15-v1`. No live store, artwork, app code, publication or order change occurred. These local documentation/skill changes have not been pushed or deployed and are not yet in a verified off-machine snapshot.

## Account and browser clarification — September 15, 2026

Owner specified `admin@sourdoughhousebakery.com` for every signed-in project service, including Printful, Shopify and any requested Etsy channel. The companion stores expected values in `references/store-context.json`; verify live email plus store separately. The earlier internal-only rule was superseded by the owner-approved dedicated Chrome profile `sourdoughhousebakery.com`. On mismatch, pause affected provider work without signing out or switching another task’s shared session. Bakery Chrome and the internal browser have separate login storage, allowing concurrent store work across those two surfaces. Work sharing the same profile still shares its logins. Project/artwork preparation can proceed concurrently. These rules do not implement a lock. Printful and Shopify identities were verified in that Chrome profile September 15; recheck live before subsequent account-dependent work.
