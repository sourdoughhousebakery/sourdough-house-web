import { BookOpen, ShoppingBag, Wheat } from "lucide-react";
import { homeNextStepsContent } from "@/content/site-content";
import { ButtonLink } from "./button-link";
import { MotionSection } from "./motion-section";

const iconByName = {
  BookOpen,
  ShoppingBag,
  Wheat
};

export function HomeNextSteps() {
  return (
    <MotionSection className="px-5 py-14">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-rust">{homeNextStepsContent.eyebrow}</p>
          <h2 className="mt-3 font-serif text-4xl leading-tight text-espresso md:text-5xl">{homeNextStepsContent.title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-semibold leading-6 text-espresso/62">{homeNextStepsContent.description}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {homeNextStepsContent.items.map(({ title, description, href, ctaLabel, icon }) => {
            const Icon = iconByName[icon];

            return (
              <article key={title} className="flex h-full flex-col rounded-[1.5rem] border border-espresso/10 bg-white p-5 shadow-soft">
                <div className="inline-flex size-11 items-center justify-center rounded-full bg-gold/14 text-rust">
                  <Icon aria-hidden size={20} />
                </div>
                <h3 className="mt-5 font-serif text-3xl leading-tight text-espresso">{title}</h3>
                <p className="mt-3 text-sm font-semibold leading-6 text-espresso/64">{description}</p>
                <div className="mt-auto pt-6">
                  <ButtonLink href={href} variant="secondary" className="min-h-10 px-4">
                    {ctaLabel}
                  </ButtonLink>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </MotionSection>
  );
}
