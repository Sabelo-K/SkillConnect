import { NextRequest, NextResponse } from "next/server";
import { markCommissionPaid } from "@/lib/store";
import { requireAdmin } from "@/lib/adminAuth";

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = requireAdmin(_request);
  if (deny) return deny;
  try {
    const { id } = await params;
    const job = await markCommissionPaid(id);
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
    return NextResponse.json(job);
  } catch {
    return NextResponse.json({ error: "Failed to update commission" }, { status: 500 });
  }
}
