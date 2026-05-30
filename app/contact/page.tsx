import type { Metadata } from "next";
import { AdminPreviewContactPillLinks } from "@/components/admin-preview-content";
import { PageIntro } from "@/components/page-intro";
import { pageIntros } from "@/content/site-content";
import { diskAdminDataSource } from "@/lib/admin-data/disk";
import { getHotplateUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Sourdough House Bakery for orders, custom requests, and local pickup details."
};

export default async function ContactPage() {
  const [announcement, contact, testimonials] = await Promise.all([
    diskAdminDataSource.announcement.get(),
    diskAdminDataSource.contact.get(),
    diskAdminDataSource.testimonials.list()
  ]);
  const defaultContent = { announcement, contact, testimonials };
  const contactCards = [
    {
      title: "Order drops",
      description: "Use Hotplate for the current weekly menu, checkout, and pickup details.",
      href: getHotplateUrl(),
      label: "Open Hotplate"
    },
    {
      title: "Custom requests",
      description: "Ask about cakes, party boxes, seasonal bakes, or larger pickup orders.",
      href: `mailto:${contact.email}`,
      label: contact.email
    }
  ];

  return (
    <>
      <PageIntro eyebrow={pageIntros.contact.eyebrow} title={pageIntros.contact.title}>
        <p>{pageIntros.contact.description}</p>
      </PageIntro>
      <section className="px-5 pb-20">
        <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
          {contactCards.map((card) => (
            <article key={card.title} className="rounded-[2rem] border border-espresso/10 bg-white p-6 shadow-soft md:p-8">
              <h2 className="font-serif text-4xl text-espresso">{card.title}</h2>
              <p className="mt-4 text-base leading-7 text-espresso/68">{card.description}</p>
              <a className="mt-6 inline-flex font-bold text-rust hover:text-espresso" href={card.href} target={card.href.startsWith("http") ? "_blank" : undefined} rel={card.href.startsWith("http") ? "noreferrer" : undefined}>
                {card.label}
              </a>
            </article>
          ))}
        </div>
        <div className="mx-auto mt-8 flex max-w-5xl flex-wrap justify-center gap-3">
          <AdminPreviewContactPillLinks defaultContent={defaultContent} />
        </div>
      </section>
    </>
  );
}
