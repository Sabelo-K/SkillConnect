import { NextRequest, NextResponse } from "next/server";
import { getReviews, addReview, getJobById } from "@/lib/store";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workerId = searchParams.get("workerId") ?? undefined;
    const reviews = await getReviews(workerId);
    return NextResponse.json(reviews);
  } catch {
    return NextResponse.json({ error: "Failed to load reviews" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobId, rating, comment, reviewerName } = body;

    const job = await getJobById(jobId);
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
    if (job.status !== "completed") return NextResponse.json({ error: "Job not completed yet" }, { status: 400 });
    if (!job.matchedWorkerId) return NextResponse.json({ error: "No worker on this job" }, { status: 400 });
    if (rating < 1 || rating > 5) return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });

    // Prevent duplicate reviews for the same job
    const { data: existing } = await supabase
      .from("reviews")
      .select("id")
      .eq("job_id", jobId)
      .maybeSingle();
    if (existing) {
      return NextResponse.json({ error: "A review has already been submitted for this job." }, { status: 409 });
    }

    const review = await addReview({
      jobId,
      workerId: job.matchedWorkerId,
      rating: Number(rating),
      comment: comment ?? "",
      reviewerName: reviewerName ?? "Anonymous",
    });
    return NextResponse.json(review, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
