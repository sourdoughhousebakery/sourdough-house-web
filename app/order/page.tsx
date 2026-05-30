import type { Metadata } from "next";
import { OrderPanel } from "@/components/order-panel";
import { PageIntro } from "@/components/page-intro";
import { pageIntros } from "@/content/site-content";
import { getHotplateUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Order",
  description: "Order Sourdough House Bakery drops through Hotplate for local pickup."
};

export default function OrderPage() {
  return (
    <>
      <PageIntro eyebrow={pageIntros.order.eyebrow} title={pageIntros.order.title}>
        <p>{pageIntros.order.description}</p>
      </PageIntro>
      <OrderPanel />
      <section className="px-5 pb-20">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-espresso/10 bg-white p-6 text-center shadow-soft md:p-10">
          <h2 className="font-serif text-4xl text-espresso">Ready for this week&apos;s bake?</h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-espresso/68">
            Open the storefront, choose what is available, and reserve it before the pickup window fills.
          </p>
          <a
            href={getHotplateUrl()}
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-flex min-h-12 items-center rounded-full bg-espresso px-6 text-sm font-black text-cream transition hover:-translate-y-0.5"
          >
            Open Sourdough House on Hotplate
          </a>
        </div>
      </section>
    </>
  );
}
