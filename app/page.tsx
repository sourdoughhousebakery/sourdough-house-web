import { AdminPreviewAnnouncement } from "@/components/admin-preview-content";
import { Hero } from "@/components/hero";
import { HomeFeaturedCatalog } from "@/components/home-featured-catalog";
import { HomeNextSteps } from "@/components/home-next-steps";
import { MenuGrid } from "@/components/menu-grid";
import { MotionSection } from "@/components/motion-section";
import { TestimonialBand } from "@/components/testimonial-band";
import { ButtonLink } from "@/components/button-link";
import { homeContent } from "@/content/site-content";
import { adminDataSource } from "@/lib/admin-data/source";
import { getDisplayMenu } from "@/lib/hotplate/api";
import { getHotplateUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [menu, featuredCatalog, hero, announcement, contact, testimonials] = await Promise.all([
    getDisplayMenu(3),
    adminDataSource.catalog.listFeatured(3),
    adminDataSource.hero.get(),
    adminDataSource.announcement.get(),
    adminDataSource.contact.get(),
    adminDataSource.testimonials.list()
  ]);
  const defaultContent = { hero, announcement, contact, testimonials };

  return (
    <>
      <Hero content={hero} />
      <AdminPreviewAnnouncement defaultContent={defaultContent} />
      <MotionSection id="fresh-bakes" className="px-5 pb-16 pt-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-rust">
                {menu.source === "fallback" ? homeContent.featuredMenu.fallbackEyebrow : homeContent.featuredMenu.liveEyebrow}
              </p>
              <h2 className="mt-3 font-serif text-4xl leading-tight text-espresso md:text-5xl">{menu.source === "fallback" ? "A taste of what we bake." : homeContent.featuredMenu.title}</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-espresso/75">
                {menu.source === "fallback"
                  ? "A few bakery favorites. Visit Hotplate for current availability and pickup times."
                  : "Choose a little something for your table. Order and select your pickup on Hotplate."}
              </p>
            </div>
            <ButtonLink href="/menu" variant="secondary">
              {homeContent.featuredMenu.ctaLabel}
            </ButtonLink>
          </div>
          {menu.source === "fallback" ? (
            <HomeFeaturedCatalog fallbackItems={featuredCatalog} />
          ) : (
            <MenuGrid items={menu.displayItems} hotplateUrl={getHotplateUrl()} />
          )}
        </div>
      </MotionSection>
      <HomeNextSteps />
      <TestimonialBand />
    </>
  );
}
