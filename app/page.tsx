import { AdminPreviewAnnouncement } from "@/components/admin-preview-content";
import { Hero } from "@/components/hero";
import { HomeFeaturedCatalog } from "@/components/home-featured-catalog";
import { HomeNextSteps } from "@/components/home-next-steps";
import { MenuGrid } from "@/components/menu-grid";
import { MotionSection } from "@/components/motion-section";
import { TestimonialBand } from "@/components/testimonial-band";
import { ButtonLink } from "@/components/button-link";
import { homeContent } from "@/content/site-content";
import { diskAdminDataSource } from "@/lib/admin-data/disk";
import { getDisplayMenu } from "@/lib/hotplate/api";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [menu, featuredCatalog, announcement, contact, testimonials] = await Promise.all([
    getDisplayMenu(3),
    diskAdminDataSource.catalog.listFeatured(3),
    diskAdminDataSource.announcement.get(),
    diskAdminDataSource.contact.get(),
    diskAdminDataSource.testimonials.list()
  ]);
  const defaultContent = { announcement, contact, testimonials };

  return (
    <>
      <Hero />
      <AdminPreviewAnnouncement defaultContent={defaultContent} />
      <MotionSection className="px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-rust">
                {menu.source === "fallback" ? homeContent.featuredMenu.fallbackEyebrow : homeContent.featuredMenu.liveEyebrow}
              </p>
              <h2 className="mt-3 font-serif text-5xl leading-none text-espresso">{homeContent.featuredMenu.title}</h2>
            </div>
            <ButtonLink href="/menu" variant="secondary">
              {homeContent.featuredMenu.ctaLabel}
            </ButtonLink>
          </div>
          {menu.source === "fallback" ? (
            <HomeFeaturedCatalog fallbackItems={featuredCatalog} />
          ) : (
            <MenuGrid items={menu.displayItems} compact />
          )}
        </div>
      </MotionSection>
      <HomeNextSteps />
      <TestimonialBand />
    </>
  );
}
