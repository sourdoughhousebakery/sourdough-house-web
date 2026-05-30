import type { Metadata } from "next";
import { AdminWorkspace } from "@/components/admin-workspace";
import { PageIntro } from "@/components/page-intro";
import { pageIntros } from "@/content/site-content";
import { diskAdminDataSource } from "@/lib/admin-data/disk";

export const metadata: Metadata = {
  title: "Admin Preview",
  description: "Placeholder admin editor for the Sourdough House Bakery catalog."
};

export default async function AdminPage() {
  const [catalogItems, announcement, contact, testimonials] = await Promise.all([
    diskAdminDataSource.catalog.list(),
    diskAdminDataSource.announcement.get(),
    diskAdminDataSource.contact.get(),
    diskAdminDataSource.testimonials.list()
  ]);
  const defaultContent = { announcement, contact, testimonials };

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
