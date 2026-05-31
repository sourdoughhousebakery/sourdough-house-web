import Link from "next/link";
import { navItems } from "@/content/site-content";
import { adminDataSource } from "@/lib/admin-data/source";
import { getHotplateUrl, siteConfig } from "@/lib/site";
import { AdminPreviewContactIconLinks } from "./admin-preview-content";
import { BrandLogoLockup } from "./brand-logo-lockup";

export async function SiteFooter() {
  const [hero, announcement, contact, testimonials] = await Promise.all([
    adminDataSource.hero.get(),
    adminDataSource.announcement.get(),
    adminDataSource.contact.get(),
    adminDataSource.testimonials.list()
  ]);
  const defaultContent = { hero, announcement, contact, testimonials };

  return (
    <footer className="border-t border-espresso/10 bg-cream px-5 py-10">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="flex max-w-sm flex-col items-center text-center">
          <Link href="/" className="inline-flex focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rust" aria-label={`${siteConfig.name} home`}>
            <BrandLogoLockup orientation="vertical" width={170} color="#5a4639" />
          </Link>
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
            <AdminPreviewContactIconLinks defaultContent={defaultContent} />
          </div>
          <p className="mt-5 text-xs text-espresso/50">
            © 2026 {siteConfig.name}. Baked in small batches.
          </p>
        </div>
      </div>
    </footer>
  );
}
