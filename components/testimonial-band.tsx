import { diskAdminDataSource } from "@/lib/admin-data/disk";
import { AdminPreviewTestimonialBand } from "./admin-preview-content";

export async function TestimonialBand() {
  const [announcement, contact, testimonials] = await Promise.all([
    diskAdminDataSource.announcement.get(),
    diskAdminDataSource.contact.get(),
    diskAdminDataSource.testimonials.list()
  ]);
  return <AdminPreviewTestimonialBand defaultContent={{ announcement, contact, testimonials }} />;
}
