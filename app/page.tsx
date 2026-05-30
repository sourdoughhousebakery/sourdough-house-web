import { AdminPreviewAnnouncement } from "@/components/admin-preview-content";
import { Hero } from "@/components/hero";
import { CatalogGrid } from "@/components/catalog-grid";
import { MenuGrid } from "@/components/menu-grid";
import { MotionSection } from "@/components/motion-section";
import { OrderPanel } from "@/components/order-panel";
import { ProcessBand } from "@/components/process-band";
import { StoryPreview } from "@/components/story-preview";
import { TestimonialBand } from "@/components/testimonial-band";
import { ButtonLink } from "@/components/button-link";
import { homeContent } from "@/content/site-content";
import { getFeaturedCatalogItems } from "@/lib/catalog/catalog";
import { getDefaultAdminContent } from "@/lib/admin-content/content";
import { getDisplayMenu } from "@/lib/hotplate/api";

export default async function HomePage() {
  const menu = await getDisplayMenu(3);
  const featuredCatalog = getFeaturedCatalogItems(undefined, 3);
  const defaultContent = getDefaultAdminContent();

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
            <CatalogGrid items={featuredCatalog} />
          ) : (
            <MenuGrid items={menu.displayItems} compact />
          )}
        </div>
      </MotionSection>
      <StoryPreview />
      <ProcessBand />
      <OrderPanel />
      <TestimonialBand />
    </>
  );
}
