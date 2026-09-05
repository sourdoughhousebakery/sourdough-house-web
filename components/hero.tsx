import { ArrowRight, Clock, MapPin, Sparkles } from "lucide-react";
import type { EditableHero } from "@/lib/admin-content/content";
import { BrandLogoLockup } from "./brand-logo-lockup";
import { ButtonLink } from "./button-link";

type HeroProps = {
  content: EditableHero;
};

export function Hero({ content }: HeroProps) {
  return (
    <section className="relative overflow-hidden px-5 pb-10 pt-28 md:pb-14 md:pt-36">
      <div className="mx-auto grid max-w-6xl items-center gap-6 md:gap-14 md:grid-cols-[0.78fr_1fr]">
        <div className="flex justify-center">
          <BrandLogoLockup orientation="vertical" width="clamp(180px, 25vw, 360px)" color="#5a4639" />
        </div>

        <div className="mx-auto max-w-3xl text-center md:mx-0 md:text-left">
          <p className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-white/70 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-rust shadow-soft">
            <Sparkles aria-hidden size={15} />
            {content.eyebrow}
          </p>
          <h1 className="mt-5 text-balance font-serif text-[clamp(2.6rem,5.8vw,5.5rem)] leading-[0.98] text-espresso">
            {content.title}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-espresso/75 md:mx-0 md:text-lg md:leading-8">
            {content.description}
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
            {content.primaryCtaLabel && content.primaryCtaUrl ? (
              <ButtonLink href={content.primaryCtaUrl} external={content.primaryCtaUrl.startsWith("http")}>
                {content.primaryCtaLabel} <ArrowRight aria-hidden className="ml-2" size={18} />
              </ButtonLink>
            ) : null}
            {content.secondaryCtaLabel && content.secondaryCtaUrl ? (
              <ButtonLink href={content.secondaryCtaUrl} external={content.secondaryCtaUrl.startsWith("http")} variant="secondary">
                {content.secondaryCtaLabel}
              </ButtonLink>
            ) : null}
          </div>
          <div className="mx-auto mt-6 grid max-w-xl gap-2 text-xs font-semibold text-espresso/75 md:text-sm sm:grid-cols-2 md:mx-0">
            <div className="flex items-center justify-center gap-2 md:justify-start">
              <Clock aria-hidden size={18} className="text-rust" />
              {content.firstHighlight}
            </div>
            <div className="flex items-center justify-center gap-2 md:justify-start">
              <MapPin aria-hidden size={18} className="text-rust" />
              {content.secondHighlight}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
