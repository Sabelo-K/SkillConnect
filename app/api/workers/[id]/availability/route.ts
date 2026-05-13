import { NextRequest, NextResponse } from "next/server";
import { toggleAvailability } from "@/lib/store";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const worker = await toggleAvailability(id);
    if (!worker) return NextResponse.json({ error: "Worker not found" }, { status: 404 });
    return NextResponse.json(worker);
  } catch {
    return NextResponse.json({ error: "Failed to update availability" }, { status: 500 });
  }
}
