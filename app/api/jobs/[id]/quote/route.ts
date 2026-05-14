import { NextRequest, NextResponse } from "next/server";
import { submitQuote } from "@/lib/store";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { quotedAmount, scopeNotes } = await req.json();
    if (!quotedAmount || quotedAmount <= 0) return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    const job = await submitQuote(id, Number(quotedAmount), scopeNotes ?? "");
    if (!job) return NextResponse.json({ error: "Job not found or wrong status" }, { status: 404 });
    return NextResponse.json(job);
  } catch {
    return NextResponse.json({ error: "Failed to submit quote" }, { status: 500 });
  }
}
