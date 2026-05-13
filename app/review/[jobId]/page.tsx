"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Star, CheckCircle, Wrench } from "lucide-react";
import Link from "next/link";
import { JobRequest, Worker } from "@/lib/types";

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          className="focus:outline-none"
        >
          <Star
            className={`w-10 h-10 transition-colors ${
              n <= (hovered || value)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-200"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

const LABELS = ["", "Poor", "Below average", "Good", "Very good", "Excellent"];

export default function ReviewPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<JobRequest | null>(null);
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/jobs").then((r) => r.json()),
      fetch("/api/workers").then((r) => r.json()),
    ]).then(([jobs, workers]: [JobRequest[], Worker[]]) => {
      const found = jobs.find((j) => j.id === jobId);
      if (!found || found.status !== "completed") { setNotFound(true); setLoading(false); return; }
      setJob(found);
      if (found.matchedWorkerId) {
        setWorker(workers.find((w) => w.id === found.matchedWorkerId) ?? null);
      }
      setLoading(false);
    });
  }, [jobId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setError("Please select a star rating."); return; }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, rating, comment, reviewerName }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  if (notFound) return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-gray-900 mb-2">Review link not valid</h2>
      <p className="text-gray-500">This review link is either invalid or the job hasn&apos;t been completed yet.</p>
      <Link href="/" className="mt-4 inline-block text-orange-600 hover:underline">Go to SkillConnect</Link>
    </div>
  );

  if (submitted) return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank you!</h2>
      <p className="text-gray-500 mb-2">
        Your review for <strong>{worker?.name}</strong> has been submitted.
      </p>
      <p className="text-sm text-gray-400">Your feedback helps other clients in the community make better choices.</p>
      <Link href="/" className="mt-6 inline-block bg-orange-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-orange-700 transition-colors">
        Back to SkillConnect
      </Link>
    </div>
  );

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">How was the work?</h1>
        <p className="text-gray-500 text-sm">Your review helps local workers build their reputation in the community.</p>
      </div>

      {worker && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 mb-6">
          <img src={worker.photoUrl} alt={worker.name} className="w-14 h-14 rounded-full object-cover bg-gray-100" />
          <div>
            <p className="font-semibold text-gray-900">{worker.name}</p>
            <p className="text-sm text-orange-600">{worker.trade}</p>
            <p className="text-xs text-gray-400">{worker.ward} · {worker.area}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <div className="text-center">
          <label className="block text-sm font-medium text-gray-700 mb-3">Your rating *</label>
          <StarPicker value={rating} onChange={setRating} />
          {rating > 0 && (
            <p className="text-sm font-medium text-orange-600 mt-2">{LABELS[rating]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your name</label>
          <input
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            placeholder="e.g. Mrs Naidoo"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tell us more (optional)</label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Was the work neat? Did the worker arrive on time? Would you recommend them?"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-orange-600 text-white font-semibold py-3 rounded-xl hover:bg-orange-700 disabled:opacity-60 transition-colors"
        >
          {submitting ? "Submitting..." : "Submit review"}
        </button>
      </form>
    </div>
  );
}
