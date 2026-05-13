import { NextRequest, NextResponse } from "next/server";
import { markCommissionPaid } from "@/lib/store";

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await markCommissionPaid(id);
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  return NextResponse.json(job);
}
