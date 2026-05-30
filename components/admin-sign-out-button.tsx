"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function AdminSignOutButton() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isSigningOut}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-espresso/12 bg-white px-5 text-sm font-black text-espresso shadow-soft transition hover:-translate-y-0.5 hover:text-rust disabled:cursor-not-allowed disabled:opacity-60"
    >
      <LogOut aria-hidden size={17} />
      {isSigningOut ? "Signing out..." : "Sign out"}
    </button>
  );
}
