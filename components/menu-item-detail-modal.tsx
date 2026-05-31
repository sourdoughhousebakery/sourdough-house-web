"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { isDataImageSrc } from "@/lib/images";
import { ButtonLink } from "./button-link";

export type MenuItemDetail = {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  imageAlt: string;
  priceLabel: string;
  statusLabel?: string;
  note?: string;
  actionLabel?: string;
  actionHref?: string;
  actionExternal?: boolean;
};

type MenuItemDetailModalProps = {
  item: MenuItemDetail | null;
  onClose: () => void;
};

export function MenuItemDetailModal({ item, onClose }: MenuItemDetailModalProps) {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-[110] grid place-items-center bg-espresso/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="menu-item-detail-title"
      onClick={onClose}
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
      }}
    >
      <article
        className="relative grid max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[1.5rem] bg-cream shadow-lift md:grid-cols-[0.95fr_1.05fr]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-espresso shadow-soft transition hover:text-rust"
          aria-label="Close item details"
        >
          <X aria-hidden size={20} />
        </button>

        <div className="relative min-h-72 bg-gold/10 md:min-h-full">
          <Image
            src={item.image}
            alt={item.imageAlt}
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            unoptimized={isDataImageSrc(item.image)}
            className="object-cover object-center"
          />
        </div>

        <div className="grid max-h-[92vh] gap-5 overflow-y-auto p-5 md:p-7">
          <div className="pr-12 md:pr-14">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-sage">{item.category}</p>
              <h2 id="menu-item-detail-title" className="mt-2 font-serif text-4xl leading-tight text-espresso">
                {item.name}
              </h2>
            </div>
          </div>

          {item.statusLabel ? (
            <p className="w-fit rounded-full bg-white px-3 py-1 text-xs font-black text-rust shadow-soft">{item.statusLabel}</p>
          ) : null}

          <p className="whitespace-pre-line text-sm leading-7 text-espresso/70">{item.description}</p>

          {item.note ? <p className="text-xs font-black uppercase tracking-[0.12em] text-rust">{item.note}</p> : null}

          <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-espresso/10 pt-5">
            <span className="font-hand text-3xl font-bold text-rust">{item.priceLabel}</span>
            {item.actionHref && item.actionLabel ? (
              <ButtonLink href={item.actionHref} external={item.actionExternal} variant="secondary" className="min-h-10 px-4">
                {item.actionLabel}
              </ButtonLink>
            ) : null}
          </div>
        </div>
      </article>
    </div>
  );
}
