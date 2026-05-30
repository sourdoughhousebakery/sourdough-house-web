import { NextResponse } from "next/server";
import { diskAdminDataSource } from "@/lib/admin-data/disk";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json()) as { url?: string };
  return NextResponse.json(await diskAdminDataSource.assets.link(body.url ?? ""));
}
