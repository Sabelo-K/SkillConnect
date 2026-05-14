import { NextRequest, NextResponse } from "next/server";
import { setWorkerStatus } from "@/lib/store";
import { requireAdmin } from "@/lib/adminAuth";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = requireAdmin(request);
  if (deny) return deny;
  try {
    const { id } = await params;
    const { status } = await request.json();
    if (status !== "approved" && status !== "rejected") {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    const worker = await setWorkerStatus(id, status);
    if (!worker) return NextResponse.json({ error: "Worker not found" }, { status: 404 });
    return NextResponse.json(worker);
  } catch {
    return NextResponse.json({ error: "Failed to update worker status" }, { status: 500 });
  }
}
