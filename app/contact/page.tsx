import { Facebook, Instagram, Mail, Music2 } from "lucide-react";
import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { getContactLinks, getHotplateUrl, siteConfig, type ContactLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Sourdough House Bakery for orders, custom requests, and local pickup details."
};

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
    href: `mailto:${siteConfig.email}`,
    label: siteConfig.email
  }
];

const iconByLabel = {
  Instagram,
  Facebook,
  TikTok: Music2,
  Email: Mail
};

function getLinkIcon(link: ContactLink) {
  return link.kind === "email" ? iconByLabel.Email : iconByLabel[link.label];
}

export default function ContactPage() {
  return (
    <>
      <PageIntro eyebrow="Contact" title="Questions, custom bakes, and pickup details.">
        <p>Start with Hotplate for ordering. For custom requests or event-sized bakes, send a note and include your date, quantity, and pickup needs.</p>
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
          {getContactLinks().map((link) => {
            const Icon = getLinkIcon(link);

            return (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-espresso shadow-soft transition hover:-translate-y-0.5 hover:text-rust"
              >
                <Icon aria-hidden size={18} />
                {link.label}
              </a>
            );
          })}
        </div>
      </section>
    </>
  );
}
