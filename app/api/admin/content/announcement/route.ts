import { NextResponse } from "next/server";
import { requireAdminApiUser } from "@/lib/admin-auth/admin";
import { adminDataSource } from "@/lib/admin-data/source";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAdminApiUser();
  if (denied) return denied;

  return NextResponse.json(await adminDataSource.announcement.get());
}

export async function PATCH(request: Request) {
  const denied = await requireAdminApiUser();
  if (denied) return denied;

  return NextResponse.json(await adminDataSource.announcement.update(await request.json()));
}
