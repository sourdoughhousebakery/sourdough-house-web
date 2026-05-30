import { NextResponse } from "next/server";
import { adminDataSource } from "@/lib/admin-data/source";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json()) as { url?: string };
  return NextResponse.json(await adminDataSource.assets.link(body.url ?? ""));
}
