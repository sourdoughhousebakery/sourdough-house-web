import { NextResponse } from "next/server";
import { diskAdminDataSource } from "@/lib/admin-data/disk";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await diskAdminDataSource.categories.list());
}

export async function POST(request: Request) {
  const body = (await request.json()) as { name?: string };
  return NextResponse.json(await diskAdminDataSource.categories.create(body.name ?? ""));
}

export async function DELETE(request: Request) {
  const body = (await request.json()) as { name?: string };
  return NextResponse.json(await diskAdminDataSource.categories.delete(body.name ?? ""));
}
