import { NextRequest, NextResponse } from "next/server";
import { acceptQuote } from "@/lib/store";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const job = await acceptQuote(id);
    if (!job) return NextResponse.json({ error: "Job not found or wrong status" }, { status: 404 });
    return NextResponse.json(job);
  } catch {
    return NextResponse.json({ error: "Failed to accept quote" }, { status: 500 });
  }
}
