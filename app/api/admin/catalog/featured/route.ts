import { NextResponse } from "next/server";
import { requireAdminApiUser } from "@/lib/admin-auth/admin";
import { adminDataSource } from "@/lib/admin-data/source";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const denied = await requireAdminApiUser();
  if (denied) return denied;

  const url = new URL(request.url);
  const limit = Number(url.searchParams.get("limit") ?? 3);
  return NextResponse.json(await adminDataSource.catalog.listFeatured(Number.isFinite(limit) ? limit : 3));
}
