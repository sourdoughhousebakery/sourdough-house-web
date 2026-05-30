import { NextResponse } from "next/server";
import { diskAdminDataSource } from "@/lib/admin-data/disk";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = Number(url.searchParams.get("limit") ?? 3);
  return NextResponse.json(await diskAdminDataSource.catalog.listFeatured(Number.isFinite(limit) ? limit : 3));
}
