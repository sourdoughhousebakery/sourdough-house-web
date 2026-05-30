import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin-login-form";
import { PageIntro } from "@/components/page-intro";
import { getCurrentAdminUser } from "@/lib/admin-auth/admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Sign in to manage Sourdough House Bakery site content."
};

export default async function AdminLoginPage() {
  const admin = await getCurrentAdminUser();
  if (admin) redirect("/admin");

  return (
    <>
      <PageIntro eyebrow="Admin" title="Sign in to edit the site.">
        <p>Use the bakery admin account to manage homepage content, catalog items, announcements, and contact details.</p>
      </PageIntro>
      <section className="px-5 pb-20">
        <AdminLoginForm />
      </section>
    </>
  );
}
