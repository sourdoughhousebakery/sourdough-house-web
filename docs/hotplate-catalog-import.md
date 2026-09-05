# Hotplate catalog import — September 5, 2026

The owner authorized copying saved Hotplate products to the website's “What We Bake” tab. Hotplate was inspected through its signed-in interface only; no products, drops, or settings were changed.

The Items screen had 15 products. The active Porch Pickup drop contained Jalapeño Cheddar Bread, Classic Original Bread, Triple Chocolate Chip Cookies (6), and Sourdough Biscuits (6). Excluding those product families also excludes the chocolate cookie 12-pack.

The remaining ten package entries were combined into six website cards in `data/catalog-items.json`: Italian Herb and Cheddar Bread, Birthday Cake Cookies, Lemon Blueberry Scones, Cherry Pecan Scones, Lemon Blueberry Sourdough Cake, and English Muffins. Descriptions and photo URLs came from the saved items; prices and package sizes are copied from those items. Whitespace and display names were cleaned up. Cherry Pecan remains featured, matching the previous catalog.

`scripts/import-hotplate-catalog.mjs` previews by default. With `--apply`, it backs up the existing website catalog under `.qa/catalog-backups/`, imports the six cards, and hides the four reviewed old database records without deleting them. It does not access Hotplate. It updates catalog categories only; other website content is untouched.

This is a one-time import, not an authenticated background sync. Recheck Hotplate when menu products, prices, or live-sale membership change. No Hotplate credentials are stored in the project.

Verification: the import read back and compared every imported field in all six active database records. The website preview showed four live-sale cards and six distinct “What We Bake” cards, all six catalog photos loaded, and the cookie detail modal displayed the single/3/6 package prices together. All 60 existing tests, TypeScript checking, and lint for the import script passed. The previous database catalog is backed up at `.qa/catalog-backups/2026-09-05T13-52-11.932Z.json`; the four original records also remain hidden in Supabase for recovery.
