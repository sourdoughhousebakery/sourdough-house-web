import type { ReactNode } from "react";

type PageIntroProps = {
  eyebrow: string;
  title: string;
  children: ReactNode;
};

export function PageIntro({ eyebrow, title, children }: PageIntroProps) {
  return (
    <section className="px-5 pb-12 pt-36">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-rust">{eyebrow}</p>
        <h1 className="mt-4 font-serif text-5xl leading-[0.95] text-espresso md:text-7xl">{title}</h1>
        <div className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-espresso/68">{children}</div>
      </div>
    </section>
  );
}

