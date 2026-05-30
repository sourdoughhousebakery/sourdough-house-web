import { diskAdminDataSource } from "@/lib/admin-data/disk";
import { AdminPreviewTestimonialBand } from "./admin-preview-content";

export async function TestimonialBand() {
  const [hero, announcement, contact, testimonials] = await Promise.all([
    diskAdminDataSource.hero.get(),
    diskAdminDataSource.announcement.get(),
    diskAdminDataSource.contact.get(),
    diskAdminDataSource.testimonials.list()
  ]);
  return <AdminPreviewTestimonialBand defaultContent={{ hero, announcement, contact, testimonials }} />;
}
