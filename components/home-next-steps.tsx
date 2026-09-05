import { ArrowUpRight, Bell } from "lucide-react";
import Link from "next/link";
import { homeNextStepsContent } from "@/content/site-content";
import { getHotplateUrl } from "@/lib/site";
import { ButtonLink } from "./button-link";
import { MotionSection } from "./motion-section";

export function HomeNextSteps() {
  return (
    <MotionSection className="px-5 py-6 md:py-10">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-espresso text-cream">
        <div className="p-6 md:p-10 lg:p-12">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">{homeNextStepsContent.eyebrow}</p>
              <h2 className="mt-3 max-w-xl text-balance font-serif text-4xl leading-tight md:text-5xl">{homeNextStepsContent.title}</h2>
            </div>
            <ButtonLink href={getHotplateUrl()} external className="self-start shrink-0 md:self-auto">
              Order on Hotplate <ArrowUpRight aria-hidden size={17} className="ml-2" />
            </ButtonLink>
          </div>
          <p className="mt-5 max-w-2xl text-base leading-7 text-cream/80">{homeNextStepsContent.description}</p>
          <ol className="mt-9 grid gap-7 md:grid-cols-3 md:gap-8">
            {homeNextStepsContent.items.map(({ title, description, href, ctaLabel }, index) => (
              <li key={title} className="border-t border-cream/20 pt-5">
                <span className="font-hand text-3xl text-gold" aria-hidden>0{index + 1}</span>
                <h3 className="mt-3 font-serif text-2xl">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-cream/80">{description}</p>
                <Link href={href} className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-cream underline decoration-cream/40 underline-offset-4 hover:decoration-gold">
                  {ctaLabel} <ArrowUpRight aria-hidden size={15} />
                </Link>
              </li>
            ))}
          </ol>
        </div>
        <div className="flex flex-col gap-3 border-t border-cream/15 bg-white/5 px-6 py-5 text-sm sm:flex-row sm:items-center sm:justify-between md:px-10 lg:px-12">
          <p className="flex items-center gap-3 leading-6 text-cream/85"><Bell aria-hidden size={19} className="shrink-0 text-gold" /> Missed a bake? There’s another good thing coming.</p>
          <a href={getHotplateUrl()} target="_blank" rel="noreferrer" className="inline-flex min-h-11 shrink-0 items-center font-bold text-gold underline underline-offset-4">Get bake alerts on Hotplate →</a>
        </div>
      </div>
    </MotionSection>
  );
}
