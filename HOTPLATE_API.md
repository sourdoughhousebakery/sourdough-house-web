# Hotplate API Research

## Discovery: Hotplate Public tRPC API

Hotplate uses a public tRPC API at `bets.hotplate.com/trpc/` that returns rich storefront data **without authentication**.

## Key Endpoints

All endpoints use `GET` with `?input=<JSON-encoded-params>`.

### Chef Profile
- `shop.getChefSiteSettings` → `{chefId: "<username>"}` — About text, branding colors, logo, banner, social links, restaurant name
- `shop.getChef` → `{chefUsername: "<username>"}` — Full chef details (ID, name, email, etc.)
- `chef.getProfileData` → `{chefId: "<username>" OR chefId: "<uuid>"}` — Profile with about, style, referral
- `chef.getIdByUsername` → `{chefUsername: "<username>"}` → Returns UUID

### Events (Drops)
- `shop.getPublicLiveEvents` → `{chefId: "<username>"}` — Current active drops (array)
- `shop.getPublicPastEvents` → `{chefId: "<username>", direction: "forward"}` — Past drops with full menu data
- `shop.getEvent` → `{eventId: "<uuid>", fulfillmentType: "ALL"}` → Full event detail with menu items, inventory, sections

### Menu Items (inside event data)
Each event contains:
- `menuItems` (object keyed by ID) → Full item detail: **title, price, description, image, inventoryInfo** (sold count, available count, reserved)
- `eventMenuItems` (array) → Same data, per-event context
- `eventMenuItemsWithComputedTypes` (array) → With computed inventory types
- `eventMenuSections` (array) → Menu categories/sections

### Reviews
- `review.getAllPublic` → `{chefUsername: "<username>", page: 1}` — Individual reviews with rating & text
- `review.getChefAggregateStats` → `{chefUsername: "<username>", isDeleted: false, status: "APPROVED"}` — Total reviews, avg rating, breakdown

## Data We Can Extract

### Per Product/Menu Item:
- `title` — e.g., "Jalapeño-Cheddar"
- `price` — e.g., "10.00"
- `description` — Full item description
- `image` — Uploadcare CDN URL (resizable!)
- `inventoryInfo.sold` — Number sold
- `inventoryInfo.available` — Remaining inventory
- `inventoryInfo.reserved` — In carts
- `inventoryInfo.total` — Original inventory
- `isNotesEnabled` — Can customers add notes

### Per Event/Drop:
- `title` — e.g., "BREAD DROP"
- `description` — Event description
- `status` — "complete", "live", etc.
- `goLiveTime` — When the drop goes live
- `isPickupEnabled` / `isDeliveryEnabled`
- Pickup location data (address, instructions)

### Chef Profile:
- `restaurantName` — "Sourdough House"
- `aboutSection` — Full about text
- `styles` — Branding (primaryColor, bannerColor, backgroundColor, etc.)
- `socialMediaLinks` — Instagram, Facebook, TikTok
- `isPastSalesShownOnStorefront` — Whether past sales are visible

## How to Use

```javascript
// Example: Fetch chef's live and past events with menu data
const chefId = 'sourdoughhouse'; // Hotplate username/slug

// Get settings
const settings = await fetch(`https://bets.hotplate.com/trpc/shop.getChefSiteSettings?input=${encodeURIComponent(JSON.stringify({chefId}))}`);
const settingsData = await settings.json();

// Get past events (contains menu items)
const events = await fetch(`https://bets.hotplate.com/trpc/shop.getPublicPastEvents?input=${encodeURIComponent(JSON.stringify({chefId, direction: 'forward'}))}`);
const eventsData = await events.json();

// Get event detail (full menu items with inventory)
const eventId = eventsData.result.data.pastEvents[0].id;
const event = await fetch(`https://bets.hotplate.com/trpc/shop.getEvent?input=${encodeURIComponent(JSON.stringify({eventId, fulfillmentType: 'ALL'}))}`);
const eventData = await event.json();

// Extract menu items
const items = Object.values(eventData.result.data.menuItems);
items.forEach(item => {
  console.log(`${item.title} - $${item.price}`);
  console.log(`  Sold: ${item.inventoryInfo.sold}, Available: ${item.inventoryInfo.available}`);
  console.log(`  Image: ${item.image}`);
});
```

## Limitations
- No auth required for public storefront data
- Menu items are tied to events (drops), not standalone
- Some events may have no items if they're archived
- Inventory `Infinity` means unlimited stock
- The API is not officially documented — could change without notice

## Your Sister's Storefront
She'll need her Hotplate **chefId** (username/slug from her storefront URL).
If her storefront is `hotplate.com/sourdough-house-bakery`, the chefId is `sourdough-house-bakery`.