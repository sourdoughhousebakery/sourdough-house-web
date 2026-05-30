import { ArrowRight, Clock, MapPin, Sparkles } from "lucide-react";
import Image from "next/image";
import type { EditableHero } from "@/lib/admin-content/content";
import { isDataImageSrc } from "@/lib/images";
import { ButtonLink } from "./button-link";

type HeroProps = {
  content: EditableHero;
};

export function Hero({ content }: HeroProps) {
  return (
    <section className="relative overflow-hidden px-5 pb-16 pt-32 md:pb-24 md:pt-40">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_0.92fr]">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-white/70 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-rust shadow-soft">
            <Sparkles aria-hidden size={15} />
            {content.eyebrow}
          </p>
          <h1 className="mt-6 max-w-3xl font-serif text-6xl leading-[0.9] text-espresso md:text-8xl">
            {content.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-espresso/70">
            {content.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
          <div className="mt-8 grid gap-3 text-sm font-semibold text-espresso/68 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <Clock aria-hidden size={18} className="text-rust" />
              {content.firstHighlight}
            </div>
            <div className="flex items-center gap-2">
              <MapPin aria-hidden size={18} className="text-rust" />
              {content.secondHighlight}
            </div>
          </div>
        </div>

        <div className="relative">
          {content.imageBadge ? (
            <div className="absolute -left-6 top-8 z-20 hidden whitespace-nowrap rounded-3xl bg-sage px-5 py-4 text-sm font-black text-white shadow-lift md:block">
              {content.imageBadge}
            </div>
          ) : null}
          <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white p-3 shadow-lift">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.4rem]">
              <Image
                src={content.imageSrc}
                alt={content.imageAlt}
                fill
                priority
                sizes="(min-width: 1024px) 44vw, 100vw"
                unoptimized={isDataImageSrc(content.imageSrc)}
                className="object-cover"
              />
            </div>
          </div>
          {content.imageNote ? (
            <div className="absolute -bottom-6 right-2 rounded-3xl bg-gold px-5 py-4 text-sm font-black text-espresso shadow-lift md:right-8">
              {content.imageNote}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
