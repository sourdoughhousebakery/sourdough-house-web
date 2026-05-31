import { BrandLogoLockup } from "./brand-logo-lockup";

export function HomeBrandMoment() {
  return (
    <section className="px-5 pb-14 md:pb-20">
      <div className="mx-auto flex max-w-6xl justify-center border-y border-gold/20 py-10 md:py-12">
        <BrandLogoLockup orientation="vertical" width="clamp(220px, 28vw, 360px)" color="#5a4639" />
      </div>
    </section>
  );
}
