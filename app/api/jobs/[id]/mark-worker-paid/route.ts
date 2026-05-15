import { NextRequest, NextResponse } from "next/server";
import { markWorkerPaid } from "@/lib/store";
import { requireAdmin } from "@/lib/adminAuth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const deny = requireAdmin(req);
  if (deny) return deny;
  const { id } = await params;
  const job = await markWorkerPaid(id);
  if (!job) {
    return NextResponse.json({ error: "Failed to mark worker as paid" }, { status: 500 });
  }
  return NextResponse.json(job);
}
