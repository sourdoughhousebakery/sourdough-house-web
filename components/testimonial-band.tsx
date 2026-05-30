import { getDefaultAdminContent } from "@/lib/admin-content/content";
import { AdminPreviewTestimonialBand } from "./admin-preview-content";

export function TestimonialBand() {
  return <AdminPreviewTestimonialBand defaultContent={getDefaultAdminContent()} />;
}
