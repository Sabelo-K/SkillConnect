import { NextRequest, NextResponse } from "next/server";
import { resolveDispute } from "@/lib/store";
import { requireAdmin } from "@/lib/adminAuth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = requireAdmin(req);
  if (deny) return deny;
  try {
    const { id } = await params;
    const { resolution, outcome } = await req.json();
    if (!resolution?.trim()) return NextResponse.json({ error: "Resolution note required" }, { status: 400 });
    if (outcome !== "completed" && outcome !== "cancelled") return NextResponse.json({ error: "outcome must be completed or cancelled" }, { status: 400 });
    const job = await resolveDispute(id, resolution, outcome);
    if (!job) return NextResponse.json({ error: "Failed to resolve" }, { status: 404 });
    return NextResponse.json(job);
  } catch {
    return NextResponse.json({ error: "Failed to resolve dispute" }, { status: 500 });
  }
}
