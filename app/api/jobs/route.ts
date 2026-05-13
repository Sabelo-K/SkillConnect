import { NextRequest, NextResponse } from "next/server";
import { getJobs, addJob, matchWorkerForJob, getWorkers } from "@/lib/store";
import { Trade } from "@/lib/types";

export async function GET() {
  return NextResponse.json(getJobs());
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const job = addJob({
    clientName: body.clientName,
    clientPhone: body.clientPhone,
    trade: body.trade as Trade,
    ward: body.ward,
    area: body.area,
    description: body.description,
  });

  const matched = matchWorkerForJob(job);
  if (matched) {
    job.status = "matched";
    job.matchedWorkerId = matched.id;
  }

  return NextResponse.json({ job, matchedWorker: matched ?? null }, { status: 201 });
}
