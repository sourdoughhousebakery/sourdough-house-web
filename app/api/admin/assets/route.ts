import { NextResponse } from "next/server";
import { requireAdminApiUser } from "@/lib/admin-auth/admin";
import { adminDataSource } from "@/lib/admin-data/source";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const denied = await requireAdminApiUser();
  if (denied) return denied;

  const body = (await request.json()) as { url?: string };
  return NextResponse.json(await adminDataSource.assets.link(body.url ?? ""));
}
