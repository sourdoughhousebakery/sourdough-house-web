import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export function getAdminEmails(value = process.env.ADMIN_EMAILS ?? "") {
  return value
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmailAllowed(
  email: string | undefined,
  configuredEmails = process.env.ADMIN_EMAILS ?? "",
  allowEmptyList = process.env.NODE_ENV !== "production"
) {
  if (!email) return false;

  const adminEmails = getAdminEmails(configuredEmails);
  if (adminEmails.length === 0) return allowEmptyList;

  return adminEmails.includes(email.trim().toLowerCase());
}

export async function getCurrentAdminUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  if (!isAdminEmailAllowed(data.user.email)) return null;

  return data.user;
}

export async function requireAdminApiUser() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase auth is not configured." }, { status: 503 });
  }

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return NextResponse.json({ error: "Admin login required." }, { status: 401 });
  }

  if (!isAdminEmailAllowed(data.user.email)) {
    return NextResponse.json({ error: "This account is not allowed to manage the site." }, { status: 403 });
  }

  return null;
}
