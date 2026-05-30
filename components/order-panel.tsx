import { Bell, CreditCard, ShoppingBag, Timer } from "lucide-react";
import { orderPanelContent } from "@/content/site-content";
import { getHotplateUrl } from "@/lib/site";
import { ButtonLink } from "./button-link";
import { MotionSection } from "./motion-section";

const iconByName = {
  Bell,
  ShoppingBag,
  CreditCard,
  Timer
};

export function OrderPanel() {
  return (
    <MotionSection className="px-5 py-16">
      <div className="mx-auto grid max-w-6xl gap-8 rounded-[2rem] bg-gradient-to-br from-gold to-rust p-6 text-white shadow-lift md:p-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-white/75">{orderPanelContent.eyebrow}</p>
          <h2 className="mt-3 font-serif text-5xl leading-none">{orderPanelContent.title}</h2>
          <p className="mt-5 text-lg leading-8 text-white/82">{orderPanelContent.description}</p>
          <div className="mt-7">
            <ButtonLink href={getHotplateUrl()} external variant="dark">
              {orderPanelContent.ctaLabel}
            </ButtonLink>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {orderPanelContent.steps.map(({ title, description, icon }) => {
            const Icon = iconByName[icon];

            return (
              <article key={title} className="rounded-3xl bg-white/16 p-5 backdrop-blur-sm">
                <Icon aria-hidden size={24} />
                <h3 className="mt-4 text-lg font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/78">{description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </MotionSection>
  );
}
