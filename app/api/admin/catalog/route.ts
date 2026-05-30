import { NextResponse } from "next/server";
import { diskAdminDataSource } from "@/lib/admin-data/disk";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await diskAdminDataSource.catalog.list());
}

export async function POST(request: Request) {
  return NextResponse.json(await diskAdminDataSource.catalog.create(await request.json()));
}
