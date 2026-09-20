# Shop landing layout update — September 10, 2026

Updated the existing unpublished Sourdough House design preview (`139515527253`) in `/private/tmp/sdh-shopify-theme`.

The homepage's oversized logo and split headline kept merchandise below the first screen. The introduction now follows the bakery's centered page-intro treatment: a clear shop heading, short description, existing fonts and colors. The homepage reuses the collection pages' Shopify category menu, followed by a clearly labeled category section and the existing featured products. Mobile category cards use compact image-and-text rows.

Changed theme files:
- `sections/sdh-merch-intro.liquid`
- `assets/sdh-brand.css`
- `templates/index.json`

Verification: checked desktop, 390px mobile, and 820px tablet; no horizontal overflow. Category disclosure opens, Escape closes it, and Apparel navigates to the expected collection. All three uploaded files match their local sources (semantic comparison for JSON). Shopify Theme Check found no issues in changed files; the whole-theme check still reports 165 existing MatchingTranslations errors in 33 other locale files. The introduction schema has unique setting IDs.

The theme remains unpublished. Editor: https://admin.shopify.com/store/ku4tbz-mj/themes/139515527253/editor
