import { Facebook, Instagram, Mail, Music2 } from "lucide-react";
import Link from "next/link";
import { navItems } from "@/content/site-content";
import { getContactLinks, getHotplateUrl, siteConfig, type ContactLink } from "@/lib/site";

const iconByLabel = {
  Instagram,
  Facebook,
  TikTok: Music2,
  Email: Mail
};

function getLinkIcon(link: ContactLink) {
  return link.kind === "email" ? iconByLabel.Email : iconByLabel[link.label];
}

export function SiteFooter() {
  return (
    <footer className="border-t border-espresso/10 bg-cream px-5 py-10">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Link href="/" className="font-hand text-3xl font-bold text-espresso">
            {siteConfig.shortName}
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-6 text-espresso/68">
            Slow-fermented breads, sweets, and seasonal bakes released through local Hotplate drops.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.14em] text-rust">Explore</h2>
          <div className="mt-4 grid gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-semibold text-espresso/68 hover:text-rust">
                {item.label}
              </Link>
            ))}
            <a href={getHotplateUrl()} target="_blank" rel="noreferrer" className="text-sm font-semibold text-espresso/68 hover:text-rust">
              Hotplate
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.14em] text-rust">Contact</h2>
          <div className="mt-4 flex gap-3">
            {getContactLinks().map((link) => {
              const Icon = getLinkIcon(link);

              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                  aria-label={link.label}
                  className="inline-flex size-11 items-center justify-center rounded-full bg-white text-espresso shadow-soft transition hover:-translate-y-0.5 hover:text-rust"
                >
                  <Icon aria-hidden size={18} />
                </a>
              );
            })}
          </div>
          <p className="mt-5 text-xs text-espresso/50">
            © 2026 {siteConfig.name}. Baked in small batches.
          </p>
        </div>
      </div>
    </footer>
  );
}
