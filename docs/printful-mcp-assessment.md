# Printful MCP fit assessment — September 9, 2026

Recommendation: retain the Shopify plugin plus direct Printful Ecommerce Platform Sync API and browser visual checks. Neither of the two reviewed community MCP implementations is a drop-in replacement for the bakery workflow. No MCP was installed or given credentials during this review.

## Implementations reviewed

| Implementation | Observed implementation | Fit for this Shopify workflow |
|---|---|---|
| [Purple-Horizons/printful-mcp](https://github.com/Purple-Horizons/printful-mcp) | Its sync module exposes list/get only, implemented through `/store/products`. The client supports the account-token store header. | Missing Ecommerce `/sync/variant` editing; the sync reads use the manual/API-store endpoint family. Not sufficient. |
| [Jasuni69/printful-mcp](https://github.com/Jasuni69/printful-mcp) | Product and variant create/read/update/delete handlers use `/store/products` and `/store/variants`. Its mockup tool includes canvas position, option groups, and view options. | Useful surrounding capabilities, but its variant editor targets the wrong API family for Shopify-linked products. Not sufficient without changes. |

Primary code inspected:
- [Purple-Horizons sync.py, pinned revision](https://github.com/Purple-Horizons/printful-mcp/blob/1baa8fc3ede0df957da93694447496122fdc226e/src/printful_mcp/tools/sync.py)
- [Purple-Horizons client.py, pinned revision](https://github.com/Purple-Horizons/printful-mcp/blob/1baa8fc3ede0df957da93694447496122fdc226e/src/printful_mcp/client.py)
- [Jasuni69 sync-products.ts, pinned revision](https://github.com/Jasuni69/printful-mcp/blob/feb2211e20bc700e445bfa6a9268f673bd7551cc/src/handlers/sync-products.ts)
- [Jasuni69 mockups.ts, pinned revision](https://github.com/Jasuni69/printful-mcp/blob/feb2211e20bc700e445bfa6a9268f673bd7551cc/src/handlers/mockups.ts)

This was a source-level capability review, not a runtime or full security audit. It does not establish that every available Printful MCP lacks these operations. Tool names and README claims alone are insufficient to determine endpoint compatibility.

## Requirements for a future MCP

It should support account-level token store scoping, Ecommerce `/sync/products` and `/sync/variant` reads/writes with external-ID targeting, preserving placement files and print options, catalog and per-size print-area lookup, file registration/status, parameterized mockup generation, pagination, rate-limit feedback, and resumable error handling. It must keep credentials local and out of logs.

Shopify listing/options/media/fulfillment operations still belong in the Shopify plugin. An MCP wraps Printful's API; it does not increase the API's rate limits or eliminate saved-design and customer-preview checks. Prefer adding or adopting the missing sync functionality only if that yields a concrete maintenance benefit over the verified direct workflow.

## Skill changes

- `/Users/mattbruce/.agents/skills/printful-garment-palettes/SKILL.md`: focused on garment color/contrast decisions. Detailed approved profiles, artwork preparation, and mockup presentation moved to references; existing 96-variant shirt profiles preserved.
- `/Users/mattbruce/.codex/skills/printful-shopify-sync/SKILL.md`: new focused store workflow with API, browser, and bakery-mug references. Includes resume checks, approved normalization reuse, per-size geometry, actual variant combinations, fulfillment/media verification, and test-cart cleanup.
- Corrected the universal 99-variant wording. Shopify's [documented increase to 2048](https://shopify.dev/changelog/the-product-variant-limit-is-now-2048-for-all-merchants) does not prove that every Printful publishing/import path supports that number. Existing shirt counts were not changed, and the 80-variant mug test does not validate a larger end-to-end limit.

No store products, prices, artwork, or live configuration were changed as part of this skill/MCP review.
