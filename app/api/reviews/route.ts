import { NextRequest, NextResponse } from "next/server";
import { getReviews, addReview, getJobById } from "@/lib/store";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const workerId = searchParams.get("workerId") ?? undefined;
  const reviews = await getReviews(workerId);
  return NextResponse.json(reviews);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { jobId, rating, comment, reviewerName } = body;

  const job = await getJobById(jobId);
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  if (job.status !== "completed") return NextResponse.json({ error: "Job not completed yet" }, { status: 400 });
  if (!job.matchedWorkerId) return NextResponse.json({ error: "No worker on this job" }, { status: 400 });
  if (rating < 1 || rating > 5) return NextResponse.json({ error: "Rating must be 1–5" }, { status: 400 });

  const review = await addReview({
    jobId,
    workerId: job.matchedWorkerId,
    rating: Number(rating),
    comment: comment ?? "",
    reviewerName: reviewerName ?? "Anonymous",
  });
  return NextResponse.json(review, { status: 201 });
}
