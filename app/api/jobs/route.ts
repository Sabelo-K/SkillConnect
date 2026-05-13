import { NextRequest, NextResponse } from "next/server";
import { getJobs, addJob, matchWorkerForJob } from "@/lib/store";
import { Trade } from "@/lib/types";

export async function GET() {
  const jobs = await getJobs();
  return NextResponse.json(jobs);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Match worker first to pass matchedWorkerId into addJob
  const tempJob = {
    id: "",
    clientName: body.clientName,
    clientPhone: body.clientPhone,
    trade: body.trade as Trade,
    ward: body.ward,
    area: body.area,
    description: body.description,
    status: "pending" as const,
    createdAt: "",
    commissionRate: 10,
    commissionStatus: "none" as const,
  };
  const matched = await matchWorkerForJob(tempJob);

  const job = await addJob({
    clientName: body.clientName,
    clientPhone: body.clientPhone,
    trade: body.trade as Trade,
    ward: body.ward,
    area: body.area,
    description: body.description,
    matchedWorkerId: matched?.id,
  });

  return NextResponse.json({ job, matchedWorker: matched ?? null }, { status: 201 });
}
