import type { Metadata } from "next";
import { AdminPreviewAnnouncement } from "@/components/admin-preview-content";
import { MenuTabs } from "@/components/menu-tabs";
import { PageIntro } from "@/components/page-intro";
import { pageIntros } from "@/content/site-content";
import { diskAdminDataSource } from "@/lib/admin-data/disk";
import { getDisplayMenu } from "@/lib/hotplate/api";
import { getHotplateUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Menu",
  description: "See the latest Sourdough House Bakery menu and order through Hotplate."
};

export default async function MenuPage() {
  const [menu, catalogItems, announcement, contact, testimonials] = await Promise.all([
    getDisplayMenu(),
    diskAdminDataSource.catalog.listPublic(),
    diskAdminDataSource.announcement.get(),
    diskAdminDataSource.contact.get(),
    diskAdminDataSource.testimonials.list()
  ]);
  const event = menu.event;
  const defaultContent = { announcement, contact, testimonials };

  return (
    <>
      <PageIntro
        eyebrow={menu.source === "fallback" ? pageIntros.menu.fallbackEyebrow : pageIntros.menu.liveEyebrow}
        title={pageIntros.menu.title}
      >
        <p>
          {event?.title
            ? `${event.title} is loaded from Hotplate.`
            : pageIntros.menu.fallbackDescription}
        </p>
      </PageIntro>
      <AdminPreviewAnnouncement defaultContent={defaultContent} />
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
          <MenuTabs hotplateItems={menu.displayItems} hotplateSource={menu.source} catalogItems={catalogItems} />
        </div>
      </section>
    </>
  );
}
