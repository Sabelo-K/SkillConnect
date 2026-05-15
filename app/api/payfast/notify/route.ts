import { NextRequest } from "next/server";
import { getJobById, markPaymentReceived } from "@/lib/store";
import { verifyITNSignature, PAYFAST_VALID_IPS } from "@/lib/payfast";

export async function POST(req: NextRequest) {
  // Verify source IP
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "";
  if (process.env.NODE_ENV === "production" && !PAYFAST_VALID_IPS.includes(ip)) {
    return new Response("Forbidden", { status: 403 });
  }

  const body = await req.text();
  const params = Object.fromEntries(new URLSearchParams(body));

  // Verify signature
  const { signature, ...data } = params;
  if (!verifyITNSignature(data, signature)) {
    return new Response("Invalid signature", { status: 400 });
  }

  // Only process successful payments
  if (params.payment_status !== "COMPLETE") {
    return new Response("OK", { status: 200 });
  }

  const jobId = params.m_payment_id;
  if (!jobId) return new Response("Missing job ID", { status: 400 });

  const job = await getJobById(jobId);
  if (!job) return new Response("Job not found", { status: 404 });

  // Verify amount matches what we expect (within 1 cent)
  const expected = job.quotedAmount ?? 0;
  const received = Number(params.amount_gross ?? 0);
  if (Math.abs(received - expected) > 0.01) {
    return new Response("Amount mismatch", { status: 400 });
  }

  await markPaymentReceived(jobId, params.pf_payment_id ?? "unknown");

  return new Response("OK", { status: 200 });
}
