"use client";

import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

type StickyOrderProps = {
  hotplateUrl: string;
};

export function StickyOrder({ hotplateUrl }: StickyOrderProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 border-t border-gold/20 bg-cream/92 px-4 py-3 shadow-[0_-14px_40px_rgba(54,36,25,0.12)] backdrop-blur-xl transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <a
        href={hotplateUrl}
        target="_blank"
        rel="noreferrer"
        className="mx-auto flex max-w-md items-center justify-center gap-2 rounded-full bg-espresso px-5 py-3 text-sm font-black text-cream"
      >
        <ShoppingBag aria-hidden size={18} />
        Order this week&apos;s bake
      </a>
    </div>
  );
}
