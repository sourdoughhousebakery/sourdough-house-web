import { NextResponse } from "next/server";
import { adminDataSource } from "@/lib/admin-data/source";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await adminDataSource.categories.list());
}

export async function POST(request: Request) {
  const body = (await request.json()) as { name?: string };
  return NextResponse.json(await adminDataSource.categories.create(body.name ?? ""));
}

export async function DELETE(request: Request) {
  const body = (await request.json()) as { name?: string };
  return NextResponse.json(await adminDataSource.categories.delete(body.name ?? ""));
}
