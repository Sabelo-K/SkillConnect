import { NextRequest, NextResponse } from "next/server";
import { raiseDispute } from "@/lib/store";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { reason } = await req.json();
    if (!reason?.trim()) return NextResponse.json({ error: "Reason required" }, { status: 400 });
    const job = await raiseDispute(id, reason);
    if (!job) return NextResponse.json({ error: "Failed to raise dispute" }, { status: 404 });
    return NextResponse.json(job);
  } catch {
    return NextResponse.json({ error: "Failed to raise dispute" }, { status: 500 });
  }
}
