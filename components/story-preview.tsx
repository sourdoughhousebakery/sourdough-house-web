import Image from "next/image";
import { storyParagraphs, storyPreviewContent } from "@/content/site-content";
import { ButtonLink } from "./button-link";
import { MotionSection } from "./motion-section";

export function StoryPreview() {
  return (
    <MotionSection className="px-5 py-16">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1fr] lg:items-center">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-lift">
          <Image
            src={storyPreviewContent.image.src}
            alt={storyPreviewContent.image.alt}
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-rust">{storyPreviewContent.eyebrow}</p>
          <h2 className="mt-3 font-serif text-5xl leading-none text-espresso">{storyPreviewContent.title}</h2>
          <p className="mt-6 text-lg leading-8 text-espresso/70">{storyParagraphs[0]}</p>
          <div className="mt-7">
            <ButtonLink href="/story" variant="secondary">
              {storyPreviewContent.ctaLabel}
            </ButtonLink>
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
