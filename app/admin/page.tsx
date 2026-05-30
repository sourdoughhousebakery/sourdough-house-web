import type { Metadata } from "next";
import { AdminWorkspace } from "@/components/admin-workspace";
import { PageIntro } from "@/components/page-intro";
import { bakeCatalogItems, pageIntros } from "@/content/site-content";
import { getDefaultAdminContent } from "@/lib/admin-content/content";

export const metadata: Metadata = {
  title: "Admin Preview",
  description: "Placeholder admin editor for the Sourdough House Bakery catalog."
};

export default function AdminPage() {
  const defaultContent = getDefaultAdminContent();

  return (
    <>
      <PageIntro eyebrow={pageIntros.admin.eyebrow} title={pageIntros.admin.title}>
        <p>{pageIntros.admin.description}</p>
      </PageIntro>
      <section className="px-5 pb-20">
        <AdminWorkspace defaultCatalogItems={bakeCatalogItems} defaultContent={defaultContent} />
      </section>
    </>
  );
}
