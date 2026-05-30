import Image from "next/image";
import type { PublicCatalogItem } from "@/lib/catalog/types";
import { isDataImageSrc } from "@/lib/images";
import { ButtonLink } from "./button-link";

type CatalogGridProps = {
  items: PublicCatalogItem[];
};

export function CatalogGrid({ items }: CatalogGridProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <article
          key={item.id}
          className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-espresso/10 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift"
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-gold/10">
            <Image
              src={item.image}
              alt={`${item.name} from Sourdough House Bakery`}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              unoptimized={isDataImageSrc(item.image)}
              className="object-cover transition duration-500 group-hover:scale-[1.04]"
            />
            <span className="absolute left-4 top-4 rounded-full bg-cream px-3 py-1 text-xs font-black text-rust shadow-soft">
              {item.availabilityLabel}
            </span>
          </div>
          <div className="flex flex-1 flex-col gap-4 p-5">
            <div className="grid gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-sage">{item.category}</p>
                <h2 className="mt-2 font-serif text-2xl leading-tight text-espresso">{item.name}</h2>
              </div>
              <p className="text-sm leading-6 text-espresso/66">{item.description}</p>
              <p className="min-h-4 text-xs font-bold uppercase tracking-[0.1em] text-rust">{item.note ?? ""}</p>
            </div>
            <div className="mt-auto flex items-center justify-between gap-4 pt-1">
              <span className="font-hand text-2xl font-bold text-rust">
                {item.displayPrice ?? "Ask for availability"}
              </span>
              {item.displayPrice ? (
                <ButtonLink href="/order" variant="secondary" className="min-h-10 px-4">
                  Order info
                </ButtonLink>
              ) : null}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
