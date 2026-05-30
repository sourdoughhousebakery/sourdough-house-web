import { NextResponse } from "next/server";
import { requireAdminApiUser } from "@/lib/admin-auth/admin";
import { adminDataSource } from "@/lib/admin-data/source";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const denied = await requireAdminApiUser();
  if (denied) return denied;

  const { id } = await context.params;
  return NextResponse.json(await adminDataSource.catalog.get(id));
}

export async function PATCH(request: Request, context: RouteContext) {
  const denied = await requireAdminApiUser();
  if (denied) return denied;

  const { id } = await context.params;
  return NextResponse.json(await adminDataSource.catalog.update(id, await request.json()));
}

export async function DELETE(_request: Request, context: RouteContext) {
  const denied = await requireAdminApiUser();
  if (denied) return denied;

  const { id } = await context.params;
  await adminDataSource.catalog.delete(id);
  return new NextResponse(null, { status: 204 });
}
