import type { Metadata } from "next";
import { AdminCatalogEditor } from "@/components/admin-catalog-editor";
import { PageIntro } from "@/components/page-intro";
import { bakeCatalogItems } from "@/content/site-content";

export const metadata: Metadata = {
  title: "Admin Preview",
  description: "Placeholder admin editor for the Sourdough House Bakery catalog."
};

export default function AdminPage() {
  return (
    <>
      <PageIntro eyebrow="Admin preview" title="Edit the bakery catalog.">
        <p>
          Toggle what appears in the “What we bake” tab, hide prices for items that are not always for sale, and preview the future admin workflow.
        </p>
      </PageIntro>
      <section className="px-5 pb-20">
        <div className="mx-auto max-w-6xl">
          <AdminCatalogEditor defaultItems={bakeCatalogItems} />
        </div>
      </section>
    </>
  );
}
