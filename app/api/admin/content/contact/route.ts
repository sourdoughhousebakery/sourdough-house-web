import { NextResponse } from "next/server";
import { diskAdminDataSource } from "@/lib/admin-data/disk";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await diskAdminDataSource.contact.get());
}

export async function PATCH(request: Request) {
  return NextResponse.json(await diskAdminDataSource.contact.update(await request.json()));
}
