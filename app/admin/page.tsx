import type { Metadata } from "next";
import { AdminCatalogEditor } from "@/components/admin-catalog-editor";
import { PageIntro } from "@/components/page-intro";
import { bakeCatalogItems, pageIntros } from "@/content/site-content";

export const metadata: Metadata = {
  title: "Admin Preview",
  description: "Placeholder admin editor for the Sourdough House Bakery catalog."
};

export default function AdminPage() {
  return (
    <>
      <PageIntro eyebrow={pageIntros.admin.eyebrow} title={pageIntros.admin.title}>
        <p>{pageIntros.admin.description}</p>
      </PageIntro>
      <section className="px-5 pb-20">
        <div className="mx-auto max-w-6xl">
          <AdminCatalogEditor defaultItems={bakeCatalogItems} />
        </div>
      </section>
    </>
  );
}
