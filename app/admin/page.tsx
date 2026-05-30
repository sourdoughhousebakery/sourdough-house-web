import type { Metadata } from "next";
import { AdminCatalogEditor } from "@/components/admin-catalog-editor";
import { AdminContentEditor } from "@/components/admin-content-editor";
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
        <div className="mx-auto grid max-w-6xl gap-10">
          <AdminCatalogEditor defaultItems={bakeCatalogItems} />
          <AdminContentEditor defaultContent={defaultContent} />
        </div>
      </section>
    </>
  );
}
