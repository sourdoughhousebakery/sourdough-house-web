# Direct Drop Ordering Implementation Plan

**Goal:** Let customers browse bakery products locally and enter the matching Hotplate drop without a storefront detour. Show a local preview before any push.

**Architecture:** Derive the ordering URL from the same live event that supplies the displayed menu. Keep the storefront as the fallback when there is no live event. Product cards open details; an explicit drop CTA hands off item selection, quantities, pickup, and payment to Hotplate.

**Tech Stack:** Next.js, React, Tailwind CSS, Vitest.

## Release approval

The user approved all previews and authorized pushing on September 5, 2026. Final checks: 88 tests, TypeScript, changed-file lint, and whitespace checks passed; the production build passed during final preview verification. Independent read-only review found no release-blocking issues. The pre-existing Instagram edit in `data/admin-content.json` is excluded from this release.

## Approved design

- Preserve the existing cream, gold, and espresso styling.
- Replace each live card's Order link with View details, using the existing accessible detail dialog.
- Add a prominent Shop this drop on Hotplate callout above the live grid on the menu and home pages.
- Within details, explain the handoff and link to the drop; sold-out items offer browsing other bakes.
- Use the same live destination for header, mobile ordering, and the order page.
- Keep catalog browsing and no-live-menu fallback behavior intact.
- Preview refinement: replace the oversized “Found your favorites?” panel with a compact ordering row, with explanatory copy on the left and the drop button on the right. Stack them on mobile. Build, changed-component lint, and desktop/mobile visual checks passed for this refinement.

## Implementation

1. In `lib/hotplate/api.test.ts`, cover the matching live event destination and fallback for unavailable, past, empty, or missing-event menus. Run the focused test, implement the resolver in `lib/hotplate/api.ts`, and return its URL from `getDisplayMenu`.
2. Update `components/menu-grid.tsx` and create `components/drop-order-callout.tsx`. Wire both through `components/menu-tabs.tsx`, `app/menu/page.tsx`, and `app/page.tsx`.
3. Pass the resolved destination through `app/layout.tsx`, `app/order/page.tsx`, and `components/order-panel.tsx`.
4. Run tests, lint, typecheck, and build. Inspect desktop and mobile previews, card/dialog keyboard behavior, and the actual outgoing link. Open the preview for the user. Do not push.

Existing uncommitted changes in `data/admin-content.json` belong to earlier work and must be preserved.

## Remaining inventory extension

Approved by the user after reviewing the direct ordering preview:

- Show finite remaining counts on live cards and their detail dialogs, replacing sold counts. Zero reads Sold out; unknown/unlimited inventory has no count.
- Normalize inventory without mistaking missing or invalid values for zero.
- Refresh the home/menu server data every minute while visible and when the customer returns to the tab. Reduce the shared Hotplate cache to one minute. These are periodic checks, not real-time stock reservations.
- Store the selected item ID and derive its current details from refreshed products. Keep an open dialog's focus stable when its inventory changes.
- Verify parsing/labels, full test suite, build, and browser previews. Keep all changes local pending review.

## Pickup schedule and drop alerts extension

- Verified public `shop.getEvent` fields: `timeWindows` keyed by ID with numeric epoch-millisecond `startTime`/`endTime`, `isDelivery`, and IANA `timeZone`; `orderCutoffType: Specific Time` with numeric `orderCutoffTime`.
- Current drop: Sep 12, 2026, 9 AM–noon CDT pickup; Sep 10, noon CDT cutoff.
- Verified `https://www.hotplate.com/sourdoughhouse43?sms_reminder=true` opens Hotplate's phone-number signup modal. Website links there; the customer completes signup on Hotplate.
- Add schedule lines to the approved compact ordering row on home/menu. Show a secondary alert link there, on the catalog tab, and in no-live-menu states. No separate banner or form.
- Omit unverified/missing dates, avoid treating relative cutoffs as a global fixed deadline, handle multiple windows explicitly, and format in the pickup timezone including DST.
- Verify parser and timezone edge cases, build, lint, and desktop/mobile previews. No push.
- Completed: 88 tests passed; production build, TypeScript, and changed-file lint passed. Desktop and 390px mobile previews show the verified pickup/deadline. Homepage shows the same schedule. The alert link's exact destination opens Hotplate's signup modal; no signup was submitted.

## Previous verification

- 79 tests passed, including live-drop rollover, storefront fallback, and inventory normalization/label coverage.
- Production build and TypeScript check passed; ESLint passed for all changed source files.
- Full-project lint is blocked by nine existing CommonJS-import errors in three unrelated `.qa/printful` scripts.
- Browser review at desktop and 390px mobile widths confirmed the callout, card details, keyboard activation, Escape/focus restoration, and catalog tab navigation.
- Clicking the detail dialog CTA opened the matching current Hotplate drop with its product menu visible.
- Hotplate reads have a five-second timeout per request and fall back to the storefront on failure. Shared data caching is now one minute; existing first-live-event selection is retained.
- Remaining-stock browser preview showed 9 jalapeño cheddar loaves, 16 classic loaves, 9 cookie packs, and 8 biscuit packs. The mobile detail dialog also displayed its current stock count.
- Local preview runs at `http://127.0.0.1:3000/menu`. No push or deployment performed.
