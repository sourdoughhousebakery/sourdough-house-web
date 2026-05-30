import { NextResponse } from "next/server";
import { adminDataSource } from "@/lib/admin-data/source";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await adminDataSource.contact.get());
}

export async function PATCH(request: Request) {
  return NextResponse.json(await adminDataSource.contact.update(await request.json()));
}
