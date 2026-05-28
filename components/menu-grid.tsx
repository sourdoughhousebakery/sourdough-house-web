import Image from "next/image";
import { getHotplateUrl } from "@/lib/site";
import type { FallbackMenuItem, HotplateMenuItem } from "@/lib/hotplate/types";
import { ButtonLink } from "./button-link";

type DisplayMenuItem = FallbackMenuItem | (HotplateMenuItem & { image: string });

function hasHotplateSource(item: DisplayMenuItem): item is HotplateMenuItem & { image: string } {
  return "source" in item && item.source === "hotplate";
}

type MenuGridProps = {
  items: DisplayMenuItem[];
  compact?: boolean;
};

export function MenuGrid({ items, compact = false }: MenuGridProps) {
  const hotplateUrl = getHotplateUrl();

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const isHotplate = hasHotplateSource(item);
        const isAvailable = isHotplate ? item.isAvailable : true;

        return (
          <article
            key={item.id}
            className={`group overflow-hidden rounded-[1.5rem] border border-espresso/10 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift ${
              !isAvailable ? "opacity-70" : ""
            }`}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-gold/10">
              <Image
                src={item.image}
                alt={`${item.name} from Sourdough House Bakery`}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover transition duration-500 group-hover:scale-[1.04]"
              />
              {"badge" in item && item.badge ? (
                <span className="absolute left-4 top-4 rounded-full bg-cream px-3 py-1 text-xs font-black text-rust shadow-soft">
                  {item.badge}
                </span>
              ) : null}
              {isHotplate && item.sold > 0 ? (
                <span className="absolute left-4 top-4 rounded-full bg-cream px-3 py-1 text-xs font-black text-rust shadow-soft">
                  {item.sold} sold
                </span>
              ) : null}
            </div>
            <div className="grid gap-4 p-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-sage">{item.category}</p>
                <h2 className="mt-2 font-serif text-2xl leading-tight text-espresso">{item.name}</h2>
              </div>
              <p className={`text-sm leading-6 text-espresso/66 ${compact ? "line-clamp-3" : ""}`}>
                {item.description || "Fresh from the Sourdough House kitchen."}
              </p>
              <div className="flex items-center justify-between gap-4">
                <span className="font-hand text-2xl font-bold text-rust">
                  {isAvailable ? item.price : "Sold out"}
                </span>
                <ButtonLink href={hotplateUrl} external variant="secondary" className="min-h-10 px-4">
                  Order
                </ButtonLink>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

