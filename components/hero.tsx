import { ArrowRight, Clock, MapPin, Sparkles } from "lucide-react";
import type { EditableHero } from "@/lib/admin-content/content";
import { BrandLogoLockup } from "./brand-logo-lockup";
import { ButtonLink } from "./button-link";

type HeroProps = {
  content: EditableHero;
};

export function Hero({ content }: HeroProps) {
  return (
    <section className="relative overflow-hidden px-5 pb-16 pt-32 md:pb-24 md:pt-40">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[0.78fr_1fr]">
        <div className="flex justify-center md:justify-start">
          <BrandLogoLockup orientation="vertical" width="clamp(360px, 32vw, 440px)" color="#5a4639" />
        </div>

        <div className="mx-auto max-w-3xl text-center md:mx-0 md:text-left">
          <p className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-white/70 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-rust shadow-soft">
            <Sparkles aria-hidden size={15} />
            {content.eyebrow}
          </p>
          <h1 className="mt-6 font-serif text-6xl leading-[0.9] text-espresso md:text-8xl">
            {content.title}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-espresso/70 md:mx-0">
            {content.description}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
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
          <div className="mx-auto mt-8 grid max-w-xl gap-3 text-sm font-semibold text-espresso/68 sm:grid-cols-2 md:mx-0">
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
