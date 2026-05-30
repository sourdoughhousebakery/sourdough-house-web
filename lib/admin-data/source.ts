import { diskAdminDataSource } from "./disk";
import { SupabaseAdminDataSource } from "./supabase";
import type { AdminDataSource } from "./types";

export type AdminDataSourceKind = "disk" | "supabase";

export function getAdminDataSourceKind(): AdminDataSourceKind {
  return process.env.ADMIN_DATA_SOURCE === "supabase" ? "supabase" : "disk";
}

export function createAdminDataSource(kind: AdminDataSourceKind = getAdminDataSourceKind()): AdminDataSource {
  if (kind === "supabase") {
    return new SupabaseAdminDataSource();
  }

  return diskAdminDataSource;
}

export const adminDataSource = createAdminDataSource();
