import { ArrowRight, Clock, MapPin, Sparkles } from "lucide-react";
import Image from "next/image";
import { getHotplateUrl } from "@/lib/site";
import { ButtonLink } from "./button-link";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-5 pb-16 pt-32 md:pb-24 md:pt-40">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_0.92fr]">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-white/70 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-rust shadow-soft">
            <Sparkles aria-hidden size={15} />
            Small batch · Slow fermented
          </p>
          <h1 className="mt-6 max-w-3xl font-serif text-6xl leading-[0.9] text-espresso md:text-8xl">
            Bread baked with love and patience.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-espresso/70">
            Handcrafted sourdough breads, cookies, muffins, rolls, and seasonal treats released in fresh local drops.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={getHotplateUrl()} external>
              Order on Hotplate <ArrowRight aria-hidden className="ml-2" size={18} />
            </ButtonLink>
            <ButtonLink href="/story" variant="secondary">
              Meet the bakery
            </ButtonLink>
          </div>
          <div className="mt-8 grid gap-3 text-sm font-semibold text-espresso/68 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <Clock aria-hidden size={18} className="text-rust" />
              72-hour flavor, weekly drops
            </div>
            <div className="flex items-center gap-2">
              <MapPin aria-hidden size={18} className="text-rust" />
              Easy local pickup
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-6 top-8 hidden rounded-3xl bg-sage px-5 py-4 text-sm font-black text-white shadow-lift md:block">
            Fresh this week
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white p-3 shadow-lift">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.4rem]">
              <Image
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1400&q=85"
                alt="Fresh artisan sourdough loaf on a bakery table"
                fill
                priority
                sizes="(min-width: 1024px) 44vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="absolute -bottom-6 right-2 rounded-3xl bg-gold px-5 py-4 text-sm font-black text-espresso shadow-lift md:right-8">
            Starter-fed, hand-shaped, baked to share
          </div>
        </div>
      </div>
    </section>
  );
}
