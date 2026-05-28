"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navItems } from "@/content/site-content";
import { getHotplateUrl, siteConfig } from "@/lib/site";
import { ButtonLink } from "./button-link";

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const hotplateUrl = getHotplateUrl();

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-gold/20 bg-cream/88 px-4 py-3 shadow-soft backdrop-blur-xl"
      >
        <Link
          href="/"
          className="font-hand text-2xl font-bold text-espresso focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rust"
          onClick={() => setIsOpen(false)}
        >
          {siteConfig.shortName}
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-bold transition hover:text-rust focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rust ${
                pathname === item.href ? "text-rust" : "text-espresso/68"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <ButtonLink href={hotplateUrl} external className="min-h-10 px-4">
            Order on Hotplate
          </ButtonLink>
        </div>

        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-full border border-espresso/10 bg-white text-espresso md:hidden"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? <X aria-hidden size={20} /> : <Menu aria-hidden size={20} />}
        </button>
      </nav>

      {isOpen ? (
        <div
          id="mobile-menu"
          className="mx-auto mt-2 grid max-w-6xl gap-2 rounded-3xl border border-gold/20 bg-cream p-3 shadow-soft md:hidden"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl px-4 py-3 text-sm font-bold text-espresso hover:bg-white"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <ButtonLink href={hotplateUrl} external className="w-full">
            Order on Hotplate
          </ButtonLink>
        </div>
      ) : null}
    </header>
  );
}

