import type { Metadata } from "next";
import { AdminPreviewAnnouncement } from "@/components/admin-preview-content";
import { OrderPanel } from "@/components/order-panel";
import { PageIntro } from "@/components/page-intro";
import { pageIntros } from "@/content/site-content";
import { adminDataSource } from "@/lib/admin-data/source";
import { getDisplayMenu } from "@/lib/hotplate/api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order",
  description: "Order Sourdough House Bakery drops through Hotplate for local pickup."
};

export default async function OrderPage() {
  const [hero, announcement, contact, testimonials, menu] = await Promise.all([
    adminDataSource.hero.get(),
    adminDataSource.announcement.get(),
    adminDataSource.contact.get(),
    adminDataSource.testimonials.list(),
    getDisplayMenu()
  ]);
  const defaultContent = { hero, announcement, contact, testimonials };

  return (
    <>
      <PageIntro eyebrow={pageIntros.order.eyebrow} title={pageIntros.order.title}>
        <p>{pageIntros.order.description}</p>
      </PageIntro>
      <AdminPreviewAnnouncement defaultContent={defaultContent} />
      <OrderPanel hotplateUrl={menu.orderUrl} />
      <section className="px-5 pb-20">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-espresso/10 bg-white p-6 text-center shadow-soft md:p-10">
          <h2 className="font-serif text-4xl text-espresso">Ready for this week&apos;s bake?</h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-espresso/68">
            {menu.source === "live"
              ? "Head straight to the current drop to choose your items, quantities, and pickup."
              : "Visit Hotplate for upcoming drops, availability, and pickup details."}
          </p>
          <a
            href={menu.orderUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-flex min-h-12 items-center rounded-full bg-espresso px-6 text-sm font-black text-cream transition hover:-translate-y-0.5"
          >
            {menu.source === "live" ? "Shop this drop on Hotplate" : "Visit Sourdough House on Hotplate"}
          </a>
        </div>
      </section>
    </>
  );
}
