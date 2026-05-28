import { Star } from "lucide-react";
import { testimonials } from "@/content/site-content";
import { MotionSection } from "./motion-section";

export function TestimonialBand() {
  return (
    <MotionSection className="px-5 py-16">
      <div className="mx-auto max-w-5xl text-center">
        <div className="flex justify-center gap-1 text-gold" aria-label="Five star customer rating">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} aria-hidden size={20} fill="currentColor" />
          ))}
        </div>
        <blockquote className="mt-5 font-serif text-3xl italic leading-snug text-espresso md:text-5xl">
          “{testimonials[0].quote}”
        </blockquote>
        <p className="mt-5 text-sm font-black uppercase tracking-[0.14em] text-rust">
          {testimonials[0].name} · {testimonials[0].source}
        </p>
      </div>
    </MotionSection>
  );
}

