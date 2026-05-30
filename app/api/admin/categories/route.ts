import { NextResponse } from "next/server";
import { requireAdminApiUser } from "@/lib/admin-auth/admin";
import { adminDataSource } from "@/lib/admin-data/source";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAdminApiUser();
  if (denied) return denied;

  return NextResponse.json(await adminDataSource.categories.list());
}

export async function POST(request: Request) {
  const denied = await requireAdminApiUser();
  if (denied) return denied;

  const body = (await request.json()) as { name?: string };
  return NextResponse.json(await adminDataSource.categories.create(body.name ?? ""));
}

export async function DELETE(request: Request) {
  const denied = await requireAdminApiUser();
  if (denied) return denied;

  const body = (await request.json()) as { name?: string };
  return NextResponse.json(await adminDataSource.categories.delete(body.name ?? ""));
}
