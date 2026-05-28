// Hotplate API Integration for Sourdough House Bakery
// Fetches live menu, events, and reviews from Hotplate's public tRPC API

const HOTPLATE_CHEF_ID = 'sourdoughhouse';
const HOTPLATE_API_BASE = 'https://bets.hotplate.com/trpc';

class HotplateMenu {
  constructor(chefId = HOTPLATE_CHEF_ID) {
    this.chefId = chefId;
    this.cache = {};
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
  }

  async _fetch(endpoint, input) {
    const url = `${HOTPLATE_API_BASE}/${endpoint}?input=${encodeURIComponent(JSON.stringify(input))}`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Hotplate API ${resp.status}: ${endpoint}`);
    const data = await resp.json();
    if (data.error) throw new Error(`Hotplate API error: ${data.error.message}`);
    return data.result?.data;
  }

  _cached(key, fetcher) {
    const now = Date.now();
    if (this.cache[key] && now - this.cache[key].ts < this.cacheExpiry) {
      return this.cache[key].promise;
    }
    this.cache[key] = { ts: now, promise: fetcher() };
    return this.cache[key].promise;
  }

  // Get chef profile and branding
  async getProfile() {
    return this._cached('profile', () => this._fetch('shop.getChefSiteSettings', { chefId: this.chefId }));
  }

  // Get chef UUID
  async getChefId() {
    return this._cached('chefId', () => this._fetch('chef.getIdByUsername', { chefUsername: this.chefId }));
  }

  // Get current live events/drops
  async getLiveEvents() {
    return this._cached('liveEvents', () => this._fetch('shop.getPublicLiveEvents', { chefId: this.chefId }));
  }

  // Get past events
  async getPastEvents() {
    return this._cached('pastEvents', () => this._fetch('shop.getPublicPastEvents', { chefId: this.chefId, direction: 'forward' }));
  }

  // Get full event detail with menu items
  async getEventDetail(eventId) {
    return this._cached(`event-${eventId}`, () => this._fetch('shop.getEvent', { eventId, fulfillmentType: 'ALL' }));
  }

  // Get reviews
  async getReviews(page = 1) {
    return this._cached(`reviews-${page}`, () => this._fetch('review.getAllPublic', { chefUsername: this.chefId, page }));
  }

  // Get review stats
  async getReviewStats() {
    return this._cached('reviewStats', () => this._fetch('review.getChefAggregateStats', { chefUsername: this.chefId, isDeleted: false, status: 'APPROVED' }));
  }

  // ---- High-level helpers ----

  // Get all menu items from the most recent event (live or past)
  async getCurrentMenu() {
    let events = await this.getLiveEvents();
    let source = 'live';
    
    if (!events || events.length === 0) {
      const pastData = await this.getPastEvents();
      events = pastData?.pastEvents || [];
      source = 'past';
    }

    if (!events || events.length === 0) return { items: [], source: null, event: null };

    // Get the most recent event's full details
    const event = events[0];
    const detail = await this.getEventDetail(event.id);
    if (!detail) return { items: [], source, event };

    const items = Object.values(detail.menuItems || {})
      .filter(item => !item.isDeleted)
      .sort((a, b) => (a.sectionIndex ?? 0) - (b.sectionIndex ?? 0));

    return {
      items,
      sections: detail.eventMenuSections || [],
      source,
      event: {
        id: event.id,
        title: detail.title,
        description: detail.description,
        image: detail.image,
        status: detail.status,
        goLiveTime: detail.goLiveTime,
        isPickupEnabled: detail.isPickupEnabled,
        isDeliveryEnabled: detail.isDeliveryEnabled,
      }
    };
  }

  // Get formatted menu for display
  async getFormattedMenu() {
    const menu = await this.getCurrentMenu();
    if (!menu.items.length) return null;

    return {
      eventTitle: menu.event?.title || 'Current Menu',
      eventStatus: menu.event?.status,
      items: menu.items.map(item => ({
        id: item.id,
        name: item.title || 'Item',
        price: item.price ? `$${item.price}` : 'Price varies',
        description: item.description || '',
        image: item.image || null,
        sold: item.inventoryInfo?.sold || 0,
        available: item.inventoryInfo?.available === 'Infinity' ? null : item.inventoryInfo?.available,
        isAvailable: item.inventoryInfo?.available !== 0 && item.inventoryInfo?.available !== '0',
      })),
      totalItems: menu.items.length,
    };
  }
}

// Export for use
window.HotplateMenu = HotplateMenu;
