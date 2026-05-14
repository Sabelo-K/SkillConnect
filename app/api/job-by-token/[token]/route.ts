import { NextRequest, NextResponse } from "next/server";
import { getJobByWorkerToken, getJobByClientToken, getWorkerById } from "@/lib/store";

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    const role = req.nextUrl.searchParams.get("role") ?? "client";
    const job = role === "worker"
      ? await getJobByWorkerToken(token)
      : await getJobByClientToken(token);
    if (!job) return NextResponse.json({ error: "Invalid or expired link" }, { status: 404 });
    // Attach worker profile for client view
    let worker = null;
    if (job.matchedWorkerId) worker = await getWorkerById(job.matchedWorkerId) ?? null;
    return NextResponse.json({ job, worker });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
