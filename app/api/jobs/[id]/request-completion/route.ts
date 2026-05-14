import { NextRequest, NextResponse } from "next/server";
import { requestCompletion } from "@/lib/store";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { completionNotes, completionPhotos } = await req.json();
    const job = await requestCompletion(id, completionNotes ?? "", completionPhotos ?? []);
    if (!job) return NextResponse.json({ error: "Job not found or wrong status" }, { status: 404 });
    return NextResponse.json(job);
  } catch {
    return NextResponse.json({ error: "Failed to submit completion" }, { status: 500 });
  }
}
