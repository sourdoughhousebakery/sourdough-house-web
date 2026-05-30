import { adminDataSource } from "@/lib/admin-data/source";
import { AdminPreviewTestimonialBand } from "./admin-preview-content";

export async function TestimonialBand() {
  const [hero, announcement, contact, testimonials] = await Promise.all([
    adminDataSource.hero.get(),
    adminDataSource.announcement.get(),
    adminDataSource.contact.get(),
    adminDataSource.testimonials.list()
  ]);
  return <AdminPreviewTestimonialBand defaultContent={{ hero, announcement, contact, testimonials }} />;
}
