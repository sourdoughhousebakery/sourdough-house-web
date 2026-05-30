import { NextResponse } from "next/server";
import { adminDataSource } from "@/lib/admin-data/source";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await adminDataSource.hero.get());
}

export async function PATCH(request: Request) {
  return NextResponse.json(await adminDataSource.hero.update(await request.json()));
}
