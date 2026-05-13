import { NextRequest, NextResponse } from "next/server";
import { toggleAvailability } from "@/lib/store";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const worker = await toggleAvailability(id);
  if (!worker) return NextResponse.json({ error: "Worker not found" }, { status: 404 });
  return NextResponse.json(worker);
}
