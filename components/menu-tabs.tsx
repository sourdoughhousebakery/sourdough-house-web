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
  const [activeTab, setActiveTab] = useState<"hotplate" | "catalog">("hotplate");

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
          <p className="mb-5 text-sm font-semibold text-espresso/62">
            {hotplateSource === "fallback"
              ? "Hotplate is not showing a live menu right now."
              : "These items are loaded from the current Hotplate drop."}
          </p>
          {hotplateItems.length > 0 ? (
            <MenuGrid items={hotplateItems} />
          ) : (
            <div className="rounded-[1.5rem] border border-espresso/10 bg-white p-5 text-sm font-semibold leading-6 text-espresso/68 shadow-soft">
              No live Hotplate items are available. Use the What we bake tab to view the editable catalog.
            </div>
          )}
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
