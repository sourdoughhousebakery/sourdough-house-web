"use client";

import { ShoppingBag, Wheat } from "lucide-react";
import { useState } from "react";
import type { PublicCatalogItem } from "@/lib/catalog/types";
import type { FallbackMenuItem, HotplateMenuItem, MenuResult } from "@/lib/hotplate/types";
import { CatalogGrid } from "./catalog-grid";
import { MenuGrid } from "./menu-grid";

type DisplayMenuItem = FallbackMenuItem | (HotplateMenuItem & { image: string });

type MenuTabsProps = {
  hotplateItems: DisplayMenuItem[];
  hotplateSource: MenuResult["source"];
  catalogItems: PublicCatalogItem[];
};

export function MenuTabs({ hotplateItems, hotplateSource, catalogItems }: MenuTabsProps) {
  const hasLiveHotplateItems = hotplateSource === "live" && hotplateItems.length > 0;
  const [activeTab, setActiveTab] = useState<"hotplate" | "catalog">("hotplate");

  if (!hasLiveHotplateItems) {
    return (
      <div className="grid gap-6">
        <div className="flex flex-col gap-3 border-y border-gold/25 py-4 text-sm font-semibold leading-6 text-espresso/68 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-rust">No live drop right now</p>
            <p className="mt-1">Ordering opens through Hotplate when the next drop is available.</p>
          </div>
          <p className="font-bold text-espresso/70">Regular bakery catalog is below.</p>
        </div>
        <div>
          <div className="mb-5">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-rust">Bakery catalog</p>
            <h2 className="mt-2 font-serif text-4xl leading-tight text-espresso">What we bake.</h2>
            <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-espresso/62">
              A standing look at breads and sweets Sourdough House is known for. Availability changes by drop.
            </p>
          </div>
          <CatalogGrid items={catalogItems} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 rounded-[1.5rem] border border-espresso/10 bg-white/70 p-3 shadow-soft sm:flex-row">
        <button
          type="button"
          onClick={() => setActiveTab("hotplate")}
          className={`inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-[1.1rem] px-4 text-sm font-black transition ${
            activeTab === "hotplate" ? "bg-espresso text-cream" : "text-espresso/68 hover:bg-white"
          }`}
        >
          <ShoppingBag aria-hidden size={18} />
          Currently on sale
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("catalog")}
          className={`inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-[1.1rem] px-4 text-sm font-black transition ${
            activeTab === "catalog" ? "bg-espresso text-cream" : "text-espresso/68 hover:bg-white"
          }`}
        >
          <Wheat aria-hidden size={18} />
          What we bake
        </button>
      </div>

      {activeTab === "hotplate" ? (
        <div>
          <p className="mb-5 text-sm font-semibold text-espresso/62">These items are loaded from the current Hotplate drop.</p>
          <MenuGrid items={hotplateItems} />
        </div>
      ) : (
        <div>
          <p className="mb-5 text-sm font-semibold text-espresso/62">
            These are the regular bakes Sourdough House is known for. Some may not be available in the current Hotplate drop.
          </p>
          <CatalogGrid items={catalogItems} />
        </div>
      )}
    </div>
  );
}
