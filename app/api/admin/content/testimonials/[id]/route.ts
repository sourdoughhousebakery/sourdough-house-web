import { NextResponse } from "next/server";
import { diskAdminDataSource } from "@/lib/admin-data/disk";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  return NextResponse.json(await diskAdminDataSource.testimonials.get(id));
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  return NextResponse.json(await diskAdminDataSource.testimonials.update(id, await request.json()));
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  await diskAdminDataSource.testimonials.delete(id);
  return new NextResponse(null, { status: 204 });
}
