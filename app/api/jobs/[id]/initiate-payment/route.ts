import { NextRequest, NextResponse } from "next/server";
import { getJobById, markPaymentPending } from "@/lib/store";
import { buildPaymentData, PAYFAST_URL } from "@/lib/payfast";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const job = await getJobById(id);

  if (!job || job.status !== "completion_requested") {
    return NextResponse.json({ error: "Invalid job state" }, { status: 400 });
  }

  if (!job.quotedAmount || job.quotedAmount <= 0) {
    return NextResponse.json({ error: "No quoted amount on this job" }, { status: 400 });
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    req.nextUrl.origin;

  const paymentData = buildPaymentData(
    { id: job.id, clientName: job.clientName, quotedAmount: job.quotedAmount, trade: job.trade },
    baseUrl
  );

  await markPaymentPending(id);

  return NextResponse.json({ payfastUrl: PAYFAST_URL, paymentData });
}
