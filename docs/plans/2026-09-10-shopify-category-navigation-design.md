# Shopify Category Navigation Design

## Goal

Replace the growing row of category pills with a compact category explorer that supports nested collections and remains easy to manage as the catalog expands.

## Approved direction

Use a Shopify Navigation menu as the source of truth. The initial hierarchy is:

- Shop all
- Apparel
  - Shirts
  - Hoodies
- Mugs
- Accessories
- Baking Sayings

New collections and subcategories can be added or reordered in Shopify Navigation without editing the theme.

## Desktop behavior

A single `Shop categories` trigger sits in the existing browse area. It opens a warm cream panel with top-level categories and their nested links. The current collection receives an amber marker and `aria-current="page"`. Collection pages also show a quiet `Viewing: <collection>` label beside the trigger.

The menu closes when the user selects a link, clicks elsewhere, or presses Escape. It uses native disclosure markup so the core navigation remains available without custom JavaScript.

## Mobile behavior

The same trigger opens a full-width disclosure panel. Parent categories with children display as grouped headings followed by generous touch targets. The component stays one row tall while closed, avoiding horizontal scrolling and wrapping.

## Visual treatment

The component keeps the current template language: warm cream surfaces, espresso text, amber active states, soft borders, rounded corners, DM Sans navigation text, and a light shadow. It is visually quieter than the product information and collection headings.

## Data and fallback behavior

The section accepts a Shopify menu setting. If no menu is assigned, it falls back to the section's existing collection list, preserving access to the current categories. Empty links are skipped.

## Validation

Verify product and collection pages on desktop and at a 375px mobile preview. Confirm nesting, current-collection highlighting, keyboard focus, Escape/click-away behavior, link destinations, and absence of horizontal overflow. The draft theme remains unpublished during review.
