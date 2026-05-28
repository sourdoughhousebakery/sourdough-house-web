import { Hero } from "@/components/hero";
import { MenuGrid } from "@/components/menu-grid";
import { MotionSection } from "@/components/motion-section";
import { OrderPanel } from "@/components/order-panel";
import { ProcessBand } from "@/components/process-band";
import { StoryPreview } from "@/components/story-preview";
import { TestimonialBand } from "@/components/testimonial-band";
import { ButtonLink } from "@/components/button-link";
import { getDisplayMenu } from "@/lib/hotplate/api";

export default async function HomePage() {
  const menu = await getDisplayMenu(3);

  return (
    <>
      <Hero />
      <MotionSection className="px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-rust">
                {menu.source === "fallback" ? "Bakery favorites" : "Fresh from Hotplate"}
              </p>
              <h2 className="mt-3 font-serif text-5xl leading-none text-espresso">This week&apos;s table.</h2>
            </div>
            <ButtonLink href="/menu" variant="secondary">
              View full menu
            </ButtonLink>
          </div>
          <MenuGrid items={menu.displayItems} compact />
        </div>
      </MotionSection>
      <StoryPreview />
      <ProcessBand />
      <OrderPanel />
      <TestimonialBand />
    </>
  );
}

