import type { Metadata } from "next";
import Image from "next/image";
import { PageIntro } from "@/components/page-intro";
import { ProcessBand } from "@/components/process-band";
import { pageIntros, storyParagraphs } from "@/content/site-content";

export const metadata: Metadata = {
  title: "Story",
  description: "The story and slow-fermentation process behind Sourdough House Bakery."
};

export default function StoryPage() {
  return (
    <>
      <PageIntro eyebrow={pageIntros.story.eyebrow} title={pageIntros.story.title}>
        <p>{pageIntros.story.description}</p>
      </PageIntro>
      <section className="px-5 pb-12">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1fr] lg:items-center">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-lift">
            <Image
              src="https://images.unsplash.com/photo-1598373182133-52452f7691ef?auto=format&fit=crop&w=1300&q=85"
              alt="Freshly baked sourdough loaves cooling together"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="grid gap-6">
            {storyParagraphs.map((paragraph) => (
              <p key={paragraph} className="text-lg leading-8 text-espresso/72">
                {paragraph}
              </p>
            ))}
            <p className="font-hand text-3xl font-bold text-rust">The Sourdough House Family</p>
          </div>
        </div>
      </section>
      <ProcessBand />
    </>
  );
}
