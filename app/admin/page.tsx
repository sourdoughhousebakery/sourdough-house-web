import type { Metadata } from "next";
import { AdminWorkspace } from "@/components/admin-workspace";
import { PageIntro } from "@/components/page-intro";
import { pageIntros } from "@/content/site-content";
import { adminDataSource } from "@/lib/admin-data/source";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Preview",
  description: "Placeholder admin editor for the Sourdough House Bakery catalog."
};

export default async function AdminPage() {
  const [catalogItems, hero, announcement, contact, testimonials] = await Promise.all([
    adminDataSource.catalog.list(),
    adminDataSource.hero.get(),
    adminDataSource.announcement.get(),
    adminDataSource.contact.get(),
    adminDataSource.testimonials.list()
  ]);
  const defaultContent = { hero, announcement, contact, testimonials };

  return (
    <>
      <PageIntro eyebrow={pageIntros.admin.eyebrow} title={pageIntros.admin.title}>
        <p>{pageIntros.admin.description}</p>
      </PageIntro>
      <section className="px-5 pb-20">
        <AdminWorkspace defaultCatalogItems={catalogItems} defaultContent={defaultContent} />
      </section>
    </>
  );
}
