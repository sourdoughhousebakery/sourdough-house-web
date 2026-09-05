"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { FallbackMenuItem, HotplateMenuItem } from "@/lib/hotplate/types";
import { formatInventoryLabel } from "@/lib/hotplate/inventory";
import { MenuItemDetailModal, type MenuItemDetail } from "./menu-item-detail-modal";

type DisplayMenuItem = FallbackMenuItem | (HotplateMenuItem & { image: string });

function hasHotplateSource(item: DisplayMenuItem): item is HotplateMenuItem & { image: string } {
  return "source" in item && item.source === "hotplate";
}

type MenuGridProps = {
  items: DisplayMenuItem[];
  hotplateUrl: string;
};

export function MenuGrid({ items, hotplateUrl }: MenuGridProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const selectedItem = useMemo<MenuItemDetail | null>(() => {
    const item = items.find((candidate) => candidate.id === selectedItemId);
    if (!item) return null;
    const isHotplate = hasHotplateSource(item);
    const isAvailable = isHotplate ? item.isAvailable : true;
    return {
      id: item.id,
      name: item.name,
      category: item.category,
      description: item.description || "Fresh from the Sourdough House kitchen.",
      image: item.image,
      imageAlt: `${item.name} from Sourdough House Bakery`,
      priceLabel: isAvailable ? item.price : "Sold out",
      statusLabel: isHotplate ? formatInventoryLabel(item.available) : item.badge,
      actionHref: hotplateUrl,
      actionLabel: isAvailable ? "Shop this drop on Hotplate" : "Browse other bakes on Hotplate",
      note: isAvailable
        ? "Select this item, quantities, and pickup on Hotplate."
        : "This item is sold out. Check the drop for other available bakes.",
      actionExternal: true
    };
  }, [items, selectedItemId, hotplateUrl]);

  return (
    <>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const isHotplate = hasHotplateSource(item);
          const isAvailable = isHotplate ? item.isAvailable : true;
          const imageAlt = `${item.name} from Sourdough House Bakery`;
          const statusLabel = isHotplate ? formatInventoryLabel(item.available) : item.badge;
          const description = item.description || "Fresh from the Sourdough House kitchen.";

          return (
            <article
              key={item.id}
              role="button"
              aria-label={`View details for ${item.name}${statusLabel ? `, ${statusLabel}` : ""}`}
              tabIndex={0}
              onClick={() => setSelectedItemId(item.id)}
              onKeyDown={(event) => {
                if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) {
                  event.preventDefault();
                  event.currentTarget.click();
                }
              }}
              className={`group flex h-full cursor-pointer flex-col overflow-hidden rounded-[1.5rem] border border-espresso/10 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rust ${
                !isAvailable ? "opacity-70" : ""
              }`}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gold/10">
                <Image
                  src={item.image}
                  alt={imageAlt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.04]"
                />
                {statusLabel ? (
                  <span className="absolute left-4 top-4 rounded-full bg-cream px-3 py-1 text-xs font-black text-rust shadow-soft">
                    {statusLabel}
                  </span>
                ) : null}
              </div>
              <div className="flex flex-1 flex-col gap-4 p-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-sage">{item.category}</p>
                  <h2 className="mt-2 font-serif text-2xl leading-tight text-espresso">{item.name}</h2>
                </div>
                <p className="line-clamp-3 text-sm leading-6 text-espresso/66">{description}</p>
                <div className="mt-auto flex items-center justify-between gap-4">
                  <span className="font-hand text-2xl font-bold text-rust">
                    {isAvailable ? item.price : "Sold out"}
                  </span>
                  <span className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-espresso/18 bg-white/70 px-4 text-sm font-bold text-espresso transition group-hover:border-espresso/35 group-hover:bg-white">
                    View details
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <MenuItemDetailModal item={selectedItem} onClose={() => setSelectedItemId(null)} />
    </>
  );
}
