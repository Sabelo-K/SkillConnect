import { NextRequest, NextResponse } from "next/server";
import { completeJob } from "@/lib/store";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const job = await completeJob(id, Number(body.jobValue), Number(body.commissionRate));
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  return NextResponse.json(job);
}
