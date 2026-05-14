import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const [{ data: workers }, { data: jobs }] = await Promise.all([
      supabase.from("workers").select("trade, area, ward, rating, review_count, jobs_completed").eq("status", "approved"),
      supabase.from("jobs").select("status, job_value, commission_amount, area, trade, created_at"),
    ]);

    const approvedWorkers = workers ?? [];
    const allJobs = jobs ?? [];
    const completedJobs = allJobs.filter((j) => j.status === "completed");

    const totalRandValue = completedJobs.reduce((s, j) => s + (j.job_value ?? 0), 0);
    const totalCommission = completedJobs.reduce((s, j) => s + (j.commission_amount ?? 0), 0);

    const ratings = approvedWorkers.filter((w) => w.review_count > 0).map((w) => Number(w.rating));
    const avgRating = ratings.length > 0 ? Math.round((ratings.reduce((s, r) => s + r, 0) / ratings.length) * 10) / 10 : 0;

    const trades = [...new Set(approvedWorkers.map((w) => w.trade))];
    const wards = [...new Set(approvedWorkers.map((w) => w.ward).filter(Boolean))];
    const areas = [...new Set(approvedWorkers.map((w) => w.area).filter(Boolean))];

    return NextResponse.json({
      totalWorkers: approvedWorkers.length,
      totalJobs: allJobs.length,
      completedJobs: completedJobs.length,
      totalRandValue,
      totalCommission,
      avgRating,
      tradesCount: trades.length,
      trades,
      wardsCount: wards.length,
      areasCount: areas.length,
    });
  } catch {
    return NextResponse.json({ error: "Failed to load impact data" }, { status: 500 });
  }
}
