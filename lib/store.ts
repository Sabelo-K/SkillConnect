import { supabase } from "./supabase";
import { Worker, JobRequest, Review, Trade } from "./types";

// ─── helpers ────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toWorker(row: any): Worker {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    trade: row.trade as Trade,
    ward: row.ward,
    area: row.area,
    yearsExperience: row.years_experience,
    bio: row.bio,
    photoUrl: row.photo_url ?? "",
    idDocumentUrl: row.id_document_url ?? "",
    workPhotos: row.work_photos ?? [],
    rating: Number(row.rating ?? 0),
    reviewCount: row.review_count ?? 0,
    tier: row.tier,
    jobsCompleted: row.jobs_completed ?? 0,
    available: row.available,
    registeredAt: row.registered_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toJob(row: any): JobRequest {
  return {
    id: row.id,
    clientName: row.client_name,
    clientPhone: row.client_phone,
    trade: row.trade as Trade,
    ward: row.ward,
    area: row.area,
    description: row.description,
    status: row.status,
    matchedWorkerId: row.matched_worker_id ?? undefined,
    createdAt: row.created_at,
    completedAt: row.completed_at ?? undefined,
    jobValue: row.job_value ?? undefined,
    commissionRate: Number(row.commission_rate ?? 10),
    commissionAmount: row.commission_amount ?? undefined,
    commissionStatus: row.commission_status,
    photoUrl: row.photo_url ?? undefined,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toReview(row: any): Review {
  return {
    id: row.id,
    jobId: row.job_id,
    workerId: row.worker_id,
    rating: row.rating,
    comment: row.comment ?? "",
    reviewerName: row.reviewer_name,
    createdAt: row.created_at,
  };
}

// ─── workers ────────────────────────────────────────────────────────────────

export async function getWorkers(): Promise<Worker[]> {
  const { data, error } = await supabase.from("workers").select("*").order("rating", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(toWorker);
}

export async function getWorkerById(id: string): Promise<Worker | undefined> {
  const { data, error } = await supabase.from("workers").select("*").eq("id", id).single();
  if (error) return undefined;
  return toWorker(data);
}

export async function addWorker(
  worker: Omit<Worker, "id" | "rating" | "reviewCount" | "tier" | "jobsCompleted" | "registeredAt">
): Promise<Worker> {
  const { data, error } = await supabase
    .from("workers")
    .insert({
      name: worker.name,
      phone: worker.phone,
      trade: worker.trade,
      ward: worker.ward,
      area: worker.area,
      years_experience: worker.yearsExperience,
      bio: worker.bio,
      photo_url: worker.photoUrl,
      id_document_url: worker.idDocumentUrl,
      work_photos: worker.workPhotos,
      available: worker.available,
      rating: 0,
      review_count: 0,
      tier: "New",
      jobs_completed: 0,
    })
    .select()
    .single();
  if (error) throw error;
  return toWorker(data);
}

export async function toggleAvailability(workerId: string): Promise<Worker | null> {
  const existing = await getWorkerById(workerId);
  if (!existing) return null;
  const { data, error } = await supabase
    .from("workers")
    .update({ available: !existing.available })
    .eq("id", workerId)
    .select()
    .single();
  if (error) throw error;
  return toWorker(data);
}

// ─── jobs ────────────────────────────────────────────────────────────────────

export async function getJobs(): Promise<JobRequest[]> {
  const { data, error } = await supabase.from("jobs").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(toJob);
}

export async function getJobById(id: string): Promise<JobRequest | undefined> {
  const { data, error } = await supabase.from("jobs").select("*").eq("id", id).single();
  if (error) return undefined;
  return toJob(data);
}

export async function addJob(
  job: Omit<JobRequest, "id" | "status" | "createdAt" | "commissionRate" | "commissionStatus">
): Promise<JobRequest> {
  const { data, error } = await supabase
    .from("jobs")
    .insert({
      client_name: job.clientName,
      client_phone: job.clientPhone,
      trade: job.trade,
      ward: job.ward,
      area: job.area,
      description: job.description,
      matched_worker_id: job.matchedWorkerId ?? null,
      status: job.matchedWorkerId ? "matched" : "pending",
      commission_rate: 10,
      commission_status: "none",
      photo_url: job.photoUrl ?? "",
    })
    .select()
    .single();
  if (error) throw error;
  return toJob(data);
}

export async function completeJob(
  jobId: string,
  jobValue: number,
  commissionRate: number
): Promise<JobRequest | null> {
  const commissionAmount = Math.round(jobValue * (commissionRate / 100));
  const { data, error } = await supabase
    .from("jobs")
    .update({
      status: "completed",
      completed_at: new Date().toISOString().split("T")[0],
      job_value: jobValue,
      commission_rate: commissionRate,
      commission_amount: commissionAmount,
      commission_status: "awaiting",
    })
    .eq("id", jobId)
    .select()
    .single();
  if (error) throw error;
  const job = toJob(data);
  // Increment worker's jobs_completed
  if (job.matchedWorkerId) {
    const worker = await getWorkerById(job.matchedWorkerId);
    if (worker) {
      await supabase
        .from("workers")
        .update({ jobs_completed: worker.jobsCompleted + 1 })
        .eq("id", job.matchedWorkerId);
    }
  }
  return job;
}

export async function markCommissionPaid(jobId: string): Promise<JobRequest | null> {
  const { data, error } = await supabase
    .from("jobs")
    .update({ commission_status: "paid" })
    .eq("id", jobId)
    .select()
    .single();
  if (error) throw error;
  return toJob(data);
}

export async function matchWorkerForJob(job: JobRequest): Promise<Worker | undefined> {
  // Try same ward first
  const { data: sameWard } = await supabase
    .from("workers")
    .select("*")
    .eq("trade", job.trade)
    .eq("ward", job.ward)
    .eq("available", true)
    .order("rating", { ascending: false })
    .limit(1);
  if (sameWard && sameWard.length > 0) return toWorker(sameWard[0]);

  // Fall back to same area
  const { data: sameArea } = await supabase
    .from("workers")
    .select("*")
    .eq("trade", job.trade)
    .eq("area", job.area)
    .eq("available", true)
    .order("rating", { ascending: false })
    .limit(1);
  if (sameArea && sameArea.length > 0) return toWorker(sameArea[0]);

  return undefined;
}

// ─── reviews ─────────────────────────────────────────────────────────────────

export async function getReviews(workerId?: string): Promise<Review[]> {
  let query = supabase.from("reviews").select("*").order("created_at", { ascending: false });
  if (workerId) query = query.eq("worker_id", workerId);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(toReview);
}

export async function addReview(
  review: Omit<Review, "id" | "createdAt">
): Promise<Review> {
  const { data, error } = await supabase
    .from("reviews")
    .insert({
      job_id: review.jobId,
      worker_id: review.workerId,
      rating: review.rating,
      comment: review.comment,
      reviewer_name: review.reviewerName,
    })
    .select()
    .single();
  if (error) throw error;

  // Recalculate worker rating + tier
  const { data: workerReviews } = await supabase
    .from("reviews")
    .select("rating")
    .eq("worker_id", review.workerId);
  if (workerReviews && workerReviews.length > 0) {
    const count = workerReviews.length;
    const avg = Math.round((workerReviews.reduce((s, r) => s + r.rating, 0) / count) * 10) / 10;
    const tier = count >= 10 && avg >= 4.5 ? "Top Rated" : count >= 3 ? "Verified" : "New";
    await supabase
      .from("workers")
      .update({ rating: avg, review_count: count, tier })
      .eq("id", review.workerId);
  }

  return toReview(data);
}

// ─── constants ───────────────────────────────────────────────────────────────

export const TRADES: Trade[] = [
  "Plumber", "Electrician", "Carpenter", "Painter",
  "Tiler", "Builder", "Welder", "General Handyman",
];
