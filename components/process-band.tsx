import { processSteps } from "@/content/site-content";
import { MotionSection } from "./motion-section";

export function ProcessBand() {
  return (
    <MotionSection className="px-5 py-16">
      <div className="mx-auto max-w-6xl rounded-[2rem] bg-espresso p-6 text-cream shadow-lift md:p-10">
        <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-gold">The rhythm</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">No shortcuts. Just better bread.</h2>
          </div>
          <p className="text-base leading-7 text-cream/70">
            The site can get flashier, but the bakery should stay honest: starter, time, heat, and pickup that works.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {processSteps.map((step) => (
            <article key={step.label} className="rounded-3xl border border-cream/10 bg-cream/7 p-5">
              <div className="font-hand text-4xl font-bold text-gold">{step.label}</div>
              <h3 className="mt-3 text-lg font-black">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-cream/66">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </MotionSection>
  );
}

