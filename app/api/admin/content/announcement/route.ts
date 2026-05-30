import { NextResponse } from "next/server";
import { diskAdminDataSource } from "@/lib/admin-data/disk";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await diskAdminDataSource.announcement.get());
}

export async function PATCH(request: Request) {
  return NextResponse.json(await diskAdminDataSource.announcement.update(await request.json()));
}
