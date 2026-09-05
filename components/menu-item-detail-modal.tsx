"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
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
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!item) return;
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [item]);

  if (!item) return null;

  return (
    <dialog
      ref={dialogRef}
      className="menu-detail-dialog"
      aria-modal="true"
      aria-labelledby="menu-item-detail-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex="0"]');
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <article
        className="relative grid w-full max-w-4xl rounded-[1.5rem] bg-cream shadow-lift md:grid-cols-[0.95fr_1.05fr]"
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

        <div className="relative min-h-48 bg-gold/10 md:min-h-full">
          <Image
            src={item.image}
            alt={item.imageAlt}
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            unoptimized={isDataImageSrc(item.image)}
            className="object-cover object-center"
          />
        </div>

        <div className="grid gap-5 p-5 md:p-7">
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
    </dialog>
  );
}
