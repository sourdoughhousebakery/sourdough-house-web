import { NextResponse } from "next/server";
import { adminDataSource } from "@/lib/admin-data/source";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await adminDataSource.catalog.list());
}

export async function POST(request: Request) {
  return NextResponse.json(await adminDataSource.catalog.create(await request.json()));
}
