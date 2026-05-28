import type { Metadata } from "next";
import { MenuGrid } from "@/components/menu-grid";
import { PageIntro } from "@/components/page-intro";
import { getDisplayMenu } from "@/lib/hotplate/api";
import { getHotplateUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Menu",
  description: "See the latest Sourdough House Bakery menu and order through Hotplate."
};

export default async function MenuPage() {
  const menu = await getDisplayMenu();
  const event = menu.event;

  return (
    <>
      <PageIntro eyebrow={menu.source === "fallback" ? "Bakery menu" : "Live menu"} title="What we bake for you.">
        <p>
          {event?.title
            ? `${event.title} is loaded from Hotplate.`
            : "Browse the bakery favorites, then open Hotplate for the current drop and checkout."}
        </p>
      </PageIntro>
      <section className="px-5 pb-20">
        <div className="mx-auto max-w-6xl">
          {menu.error ? (
            <div className="mb-6 rounded-3xl border border-rust/15 bg-white p-5 text-sm leading-6 text-espresso/70">
              Live Hotplate data is temporarily unavailable, so this page is showing fallback menu content. Checkout remains available at{" "}
              <a className="font-bold text-rust" href={getHotplateUrl()} target="_blank" rel="noreferrer">
                Hotplate
              </a>
              .
            </div>
          ) : null}
          <MenuGrid items={menu.displayItems} />
        </div>
      </section>
    </>
  );
}

