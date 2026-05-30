import { cache } from "react";
import { fallbackMenuItems } from "@/content/site-content";
import { siteConfig } from "@/lib/site";
import type { HotplateEvent, HotplateMenuItem, MenuResult } from "./types";

const HOTPLATE_API_BASE = "https://bets.hotplate.com/trpc";
const REVALIDATE_SECONDS = 300;

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asBoolean(value: unknown) {
  return typeof value === "boolean" ? value : false;
}

function asNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

export function formatHotplatePrice(value: unknown) {
  if (typeof value === "number") return `$${value.toFixed(2).replace(/\.00$/, "")}`;
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? `$${parsed.toFixed(2).replace(/\.00$/, "")}` : value;
  }
  return "See menu";
}

function sectionName(sections: unknown, index: unknown) {
  if (!Array.isArray(sections)) return "Bakery";
  const numericIndex = asNumber(index, -1);
  const found = sections.find((section) => {
    if (!isRecord(section)) return false;
    return asNumber(section.index, -2) === numericIndex || asNumber(section.sectionIndex, -2) === numericIndex;
  });

  return isRecord(found) ? asString(found.title, "Bakery") : "Bakery";
}

export function parseMenuFromEventDetail(detail: unknown): HotplateMenuItem[] {
  if (!isRecord(detail) || !isRecord(detail.menuItems)) return [];

  const sections = detail.eventMenuSections;

  return Object.values(detail.menuItems)
    .filter((item): item is UnknownRecord => isRecord(item) && item.isDeleted !== true)
    .sort((a, b) => asNumber(a.sectionIndex) - asNumber(b.sectionIndex))
    .map((item) => {
      const inventory = isRecord(item.inventoryInfo) ? item.inventoryInfo : {};
      const availableRaw = inventory.available;
      const available =
        availableRaw === "Infinity" || availableRaw === undefined ? null : asNumber(availableRaw, 0);

      return {
        id: asString(item.id, crypto.randomUUID()),
        name: asString(item.title, "Freshly Baked"),
        price: formatHotplatePrice(item.price),
        description: asString(item.description),
        image: asString(item.image) || null,
        sold: asNumber(inventory.sold),
        available,
        isAvailable: availableRaw === "Infinity" || availableRaw === undefined || asNumber(availableRaw, 0) > 0,
        category: sectionName(sections, item.sectionIndex),
        source: "hotplate" as const
      };
    });
}

function parseEvent(event: unknown, detail: unknown): HotplateEvent | null {
  if (!isRecord(event) && !isRecord(detail)) return null;
  const eventRecord = isRecord(event) ? event : {};
  const detailRecord = isRecord(detail) ? detail : {};

  return {
    id: asString(eventRecord.id ?? detailRecord.id),
    title: asString(detailRecord.title ?? eventRecord.title, "Current Bake"),
    description: asString(detailRecord.description ?? eventRecord.description),
    image: asString(detailRecord.image ?? eventRecord.image) || null,
    status: asString(detailRecord.status ?? eventRecord.status, "open"),
    goLiveTime: asString(detailRecord.goLiveTime ?? eventRecord.goLiveTime) || null,
    isPickupEnabled: asBoolean(detailRecord.isPickupEnabled ?? eventRecord.isPickupEnabled),
    isDeliveryEnabled: asBoolean(detailRecord.isDeliveryEnabled ?? eventRecord.isDeliveryEnabled)
  };
}

async function hotplateFetch<T>(endpoint: string, input: UnknownRecord): Promise<T> {
  const url = `${HOTPLATE_API_BASE}/${endpoint}?input=${encodeURIComponent(JSON.stringify(input))}`;
  const response = await fetch(url, {
    next: { revalidate: REVALIDATE_SECONDS },
    headers: { accept: "application/json" }
  });

  if (!response.ok) {
    throw new Error(`Hotplate ${endpoint} returned ${response.status}`);
  }

  const body = (await response.json()) as UnknownRecord;
  if (isRecord(body.error)) {
    throw new Error(asString(body.error.message, "Hotplate API error"));
  }

  const result = isRecord(body.result) ? body.result : {};
  return result.data as T;
}

export const getHotplateMenu = cache(async (): Promise<MenuResult> => {
  const chefId = siteConfig.hotplateChefId;
  if (!chefId) {
    return {
      items: [],
      event: null,
      source: "fallback",
      error: "HOTPLATE_CHEF_ID is not configured"
    };
  }

  try {
    const events = await hotplateFetch<unknown[]>("shop.getPublicLiveEvents", { chefId });

    const event = events.find(isRecord);
    const eventId = event ? asString(event.id) : "";
    if (!eventId) return { items: [], event: null, source: "fallback" };

    const detail = await hotplateFetch<unknown>("shop.getEvent", {
      eventId,
      fulfillmentType: "ALL"
    });
    const items = parseMenuFromEventDetail(detail);

    return {
      items,
      event: parseEvent(event, detail),
      source: items.length > 0 ? "live" : "fallback"
    };
  } catch (error) {
    return {
      items: [],
      event: null,
      source: "fallback",
      error: error instanceof Error ? error.message : "Unable to load Hotplate menu"
    };
  }
});

export function resolveDisplayMenuItems(menu: MenuResult, limit?: number) {
  const items =
    menu.source === "live" && menu.items.length > 0
      ? menu.items.map((item) => ({
          ...item,
          image: item.image ?? fallbackMenuItems[0].image
        }))
      : fallbackMenuItems;

  return typeof limit === "number" ? items.slice(0, limit) : items;
}

export async function getDisplayMenu(limit?: number) {
  const menu = await getHotplateMenu();

  return {
    ...menu,
    displayItems: resolveDisplayMenuItems(menu, limit)
  };
}
