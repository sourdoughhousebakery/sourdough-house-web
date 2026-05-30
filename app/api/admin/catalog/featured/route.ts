import { NextResponse } from "next/server";
import { adminDataSource } from "@/lib/admin-data/source";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = Number(url.searchParams.get("limit") ?? 3);
  return NextResponse.json(await adminDataSource.catalog.listFeatured(Number.isFinite(limit) ? limit : 3));
}
