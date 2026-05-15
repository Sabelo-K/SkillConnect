"use client";
import { useEffect, useState } from "react";
import { JobRequest, Worker } from "@/lib/types";

function formatTs(at: string) {
  return new Date(at).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const timelineLabels: Record<string, string> = {
  links_generated: "Accountability links created",
  quote_submitted: "Worker submitted a quote",
  quote_accepted: "Client accepted the quote",
  completion_requested: "Worker submitted completion",
  completion_confirmed: "Client confirmed completion",
  dispute_raised: "Concern raised",
  dispute_resolved: "Resolved by admin",
};

function Timeline({ events }: { events: JobRequest["timeline"] }) {
  if (!events || events.length === 0) return null;
  return (
    <div className="mt-8">
      <h2 className="text-base font-semibold text-gray-700 mb-3">Timeline</h2>
      <ol className="relative border-l-2 border-green-200 space-y-4 pl-5">
        {events.map((e, i) => (
          <li key={i} className="relative">
            <span className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
            <p className="text-sm font-medium text-gray-800">
              {timelineLabels[e.event] ?? e.event}
            </p>
            {e.note && <p className="text-xs text-gray-500 mt-0.5">{e.note}</p>}
            <p className="text-xs text-gray-400 mt-0.5">{formatTs(e.at)}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function JobCard({ job }: { job: JobRequest }) {
  return (
    <div className="bg-white rounded-xl border border-green-100 p-4 mb-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wide bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
          {job.trade}
        </span>
      </div>
      <div className="space-y-1 text-sm text-gray-700">
        <p><span className="font-medium">Area:</span> {job.area}, Ward {job.ward}</p>
        <p><span className="font-medium">Description:</span> {job.description}</p>
        <p><span className="font-medium">Requested:</span> {formatTs(job.createdAt)}</p>
      </div>
    </div>
  );
}

function WorkerCard({ worker }: { worker: Worker }) {
  return (
    <div className="bg-white rounded-xl border border-green-100 p-4 mb-4 shadow-sm flex items-center gap-4">
      {worker.photoUrl && (
        <img
          src={worker.photoUrl}
          alt={worker.name}
          className="w-14 h-14 rounded-full object-cover border-2 border-green-200 shrink-0"
        />
      )}
      <div className="min-w-0">
        <p className="font-semibold text-gray-900 text-sm">{worker.name}</p>
        <p className="text-xs text-gray-500">{worker.trade}</p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full font-medium">
            {worker.tier}
          </span>
          <span className="text-xs text-gray-600">
            ★ {worker.rating.toFixed(1)} ({worker.reviewCount})
          </span>
          <span className="text-xs text-gray-500">{worker.yearsExperience}y exp</span>
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex justify-center items-center py-16">
      <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
    </div>
  );
}

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`text-2xl transition-colors ${
            star <= value ? "text-yellow-400" : "text-gray-300"
          }`}
          aria-label={`${star} star`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function ClientPortalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const [token, setToken] = useState<string | null>(null);
  const [job, setJob] = useState<JobRequest | null>(null);
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [acceptingQuote, setAcceptingQuote] = useState(false);
  const [acceptError, setAcceptError] = useState("");
  const [showDeclineNote, setShowDeclineNote] = useState(false);

  const [initiatingPayment, setInitiatingPayment] = useState(false);
  const [confirmError, setConfirmError] = useState("");
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [disputeSubmitting, setDisputeSubmitting] = useState(false);
  const [disputeError, setDisputeError] = useState("");

  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewDone, setReviewDone] = useState(false);

  useEffect(() => {
    params.then((p) => setToken(p.token));
  }, [params]);

  useEffect(() => {
    if (!token) return;
    fetch(`/api/job-by-token/${token}?role=client`)
      .then(async (res) => {
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        setJob(data.job);
        if (data.worker) setWorker(data.worker);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [token]);

  async function acceptQuote() {
    if (!job) return;
    setAcceptingQuote(true);
    setAcceptError("");
    try {
      const res = await fetch(`/api/jobs/${job.id}/accept-quote`, {
        method: "POST",
      });
      if (!res.ok) {
        setAcceptError("Failed to accept quote. Please try again.");
        return;
      }
      const updated = await res.json();
      setJob(updated);
    } catch {
      setAcceptError("Network error. Please try again.");
    } finally {
      setAcceptingQuote(false);
    }
  }

  async function initiatePayment() {
    if (!job) return;
    setInitiatingPayment(true);
    setConfirmError("");
    try {
      const res = await fetch(`/api/jobs/${job.id}/initiate-payment`, {
        method: "POST",
      });
      if (!res.ok) {
        setConfirmError("Failed to initiate payment. Please try again.");
        return;
      }
      const { payfastUrl, paymentData } = await res.json();
      // Auto-submit a form to PayFast
      const form = document.createElement("form");
      form.method = "POST";
      form.action = payfastUrl;
      for (const [key, value] of Object.entries(paymentData)) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      }
      document.body.appendChild(form);
      form.submit();
    } catch {
      setConfirmError("Network error. Please try again.");
      setInitiatingPayment(false);
    }
  }

  async function submitDispute(e: React.FormEvent) {
    e.preventDefault();
    if (!job) return;
    setDisputeSubmitting(true);
    setDisputeError("");
    try {
      const res = await fetch(`/api/jobs/${job.id}/dispute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: disputeReason }),
      });
      if (!res.ok) {
        setDisputeError("Failed to submit. Please try again.");
        return;
      }
      const updated = await res.json();
      setJob(updated);
    } catch {
      setDisputeError("Network error. Please try again.");
    } finally {
      setDisputeSubmitting(false);
    }
  }

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!job) return;
    setReviewSubmitting(true);
    setReviewError("");
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job.id,
          workerId: job.matchedWorkerId,
          rating,
          comment: reviewComment,
          reviewerName,
        }),
      });
      if (!res.ok) {
        setReviewError("Failed to submit review. Please try again.");
        return;
      }
      setReviewDone(true);
    } catch {
      setReviewError("Network error. Please try again.");
    } finally {
      setReviewSubmitting(false);
    }
  }

  if (loading)
    return (
      <div className="min-h-screen bg-green-50">
        <div className="max-w-lg mx-auto px-4 py-10">
          <Spinner />
        </div>
      </div>
    );

  if (notFound || !job)
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-8 max-w-sm w-full text-center">
          <p className="text-2xl mb-2">🔗</p>
          <h1 className="text-lg font-semibold text-gray-800 mb-2">
            Invalid or expired link
          </h1>
          <p className="text-sm text-gray-500">
            This link is no longer valid. Please contact SkillConnect for help.
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-green-50">
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#007A4D]">
            SkillConnect
          </span>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">
            Your Job Portal
          </h1>
        </div>

        <JobCard job={job} />
        {worker && <WorkerCard worker={worker} />}

        {job.status === "matched" && (
          <div className="bg-white rounded-xl border border-green-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-600 text-xl">🔍</span>
              <h2 className="text-base font-semibold text-gray-800">
                Worker matched!
              </h2>
            </div>
            <p className="text-sm text-gray-600">
              We&apos;ve matched you with a worker. They will submit a price
              quote for your approval shortly.
            </p>
          </div>
        )}

        {job.status === "quoted" && (
          <div className="bg-white rounded-xl border border-green-100 shadow-sm p-5">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              Quote received
            </h2>
            <div className="bg-[#007A4D]/10 rounded-xl p-4 mb-4 text-center">
              <p className="text-xs uppercase tracking-wide text-[#007A4D] font-semibold mb-1">
                Agreed price
              </p>
              <p className="text-3xl font-bold text-[#007A4D]">
                R{job.quotedAmount?.toLocaleString()}
              </p>
            </div>
            {job.scopeNotes && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Scope of work
                </p>
                <p className="text-sm text-gray-700">{job.scopeNotes}</p>
              </div>
            )}
            {acceptError && (
              <p className="text-sm text-red-600 mb-3">{acceptError}</p>
            )}
            <div className="space-y-2">
              <button
                onClick={acceptQuote}
                disabled={acceptingQuote}
                className="w-full bg-[#007A4D] hover:bg-[#006040] disabled:bg-green-300 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {acceptingQuote ? "Accepting…" : "Accept Quote ✓"}
              </button>
              <button
                type="button"
                onClick={() => setShowDeclineNote((v) => !v)}
                className="w-full border border-red-400 text-red-600 hover:bg-red-50 font-semibold py-3 rounded-lg transition-colors"
              >
                Decline
              </button>
              {showDeclineNote && (
                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                  To decline, please contact us via WhatsApp:{" "}
                  <a
                    href="https://wa.me/27679467770"
                    className="text-[#007A4D] font-medium underline"
                  >
                    +27 67 946 7770
                  </a>
                </p>
              )}
            </div>
          </div>
        )}

        {job.status === "accepted" && (
          <div className="bg-white rounded-xl border border-green-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-600 text-xl">✅</span>
              <h2 className="text-base font-semibold text-gray-800">
                Quote accepted
              </h2>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Your worker is on their way!
            </p>
            <div className="bg-green-50 rounded-lg p-3 space-y-1 text-sm">
              {job.quotedAmount && (
                <p>
                  <span className="font-medium">Agreed amount:</span>{" "}
                  R{job.quotedAmount.toLocaleString()}
                </p>
              )}
              {job.scopeNotes && (
                <p>
                  <span className="font-medium">Scope:</span> {job.scopeNotes}
                </p>
              )}
            </div>
          </div>
        )}

        {job.status === "completion_requested" && (
          <div className="bg-white rounded-xl border border-green-100 shadow-sm p-5">
            <h2 className="text-base font-semibold text-gray-800 mb-3">
              Worker says the job is done
            </h2>
            {job.completionNotes && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm">
                <p className="font-medium text-gray-700 mb-1">
                  Completion notes:
                </p>
                <p className="text-gray-600">{job.completionNotes}</p>
              </div>
            )}
            {job.completionPhotos && job.completionPhotos.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Photos
                </p>
                <div className="space-y-1">
                  {job.completionPhotos.map((url, i) => {
                    const isImage = /\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(
                      url
                    );
                    return isImage ? (
                      <img
                        key={i}
                        src={url}
                        alt={`Completion photo ${i + 1}`}
                        className="w-full rounded-lg object-cover max-h-48"
                      />
                    ) : (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-[#007A4D] underline truncate"
                      >
                        Photo {i + 1}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
            {confirmError && (
              <p className="text-sm text-red-600 mb-3">{confirmError}</p>
            )}
            {!showDisputeForm && (
              <div className="space-y-2">
                {job.quotedAmount && (
                  <div className="bg-[#007A4D]/10 rounded-xl p-3 text-center mb-2">
                    <p className="text-xs text-[#007A4D] font-semibold uppercase tracking-wide mb-0.5">Amount due</p>
                    <p className="text-2xl font-bold text-[#007A4D]">R{job.quotedAmount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Secure payment via PayFast</p>
                  </div>
                )}
                <button
                  onClick={initiatePayment}
                  disabled={initiatingPayment}
                  className="w-full bg-[#007A4D] hover:bg-[#006040] disabled:bg-green-300 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  {initiatingPayment
                    ? "Redirecting to payment…"
                    : "Confirm & Pay ✓"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDisputeForm(true)}
                  className="w-full border border-red-400 text-red-600 hover:bg-red-50 font-semibold py-3 rounded-lg transition-colors"
                >
                  Raise a concern
                </button>
              </div>
            )}
            {showDisputeForm && (
              <form onSubmit={submitDispute} className="space-y-3">
                <textarea
                  required
                  rows={4}
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  placeholder="Describe the issue..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                />
                {disputeError && (
                  <p className="text-sm text-red-600">{disputeError}</p>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDisputeForm(false)}
                    className="flex-1 border border-gray-300 text-gray-600 font-semibold py-2.5 rounded-lg transition-colors hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={disputeSubmitting}
                    className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold py-2.5 rounded-lg transition-colors"
                  >
                    {disputeSubmitting ? "Submitting…" : "Submit concern"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {job.status === "payment_pending" && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-600 text-xl">⏳</span>
              <h2 className="text-base font-semibold text-blue-800">Payment processing</h2>
            </div>
            <p className="text-sm text-blue-700">
              Your payment is being processed. This page will update once it&apos;s confirmed.
              If you paid successfully, you can close this page — we&apos;ll notify you via WhatsApp.
            </p>
          </div>
        )}

        {job.status === "completed" && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
              <p className="text-3xl mb-2">🎉</p>
              <h2 className="text-lg font-semibold text-green-800 mb-1">
                Job complete!
              </h2>
              {job.quotedAmount && (
                <p className="text-base font-bold text-green-900">
                  Agreed amount: R{job.quotedAmount.toLocaleString()}
                </p>
              )}
            </div>
            {reviewDone ? (
              <div className="bg-white rounded-xl border border-green-100 shadow-sm p-5 text-center">
                <p className="text-2xl mb-2">⭐</p>
                <p className="text-base font-semibold text-gray-800">
                  Thank you for your review!
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-green-100 shadow-sm p-5">
                <h2 className="text-base font-semibold text-gray-800 mb-4">
                  Rate your worker
                </h2>
                <form onSubmit={submitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <StarRating value={rating} onChange={setRating} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Comment
                    </label>
                    <textarea
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your name
                    </label>
                    <input
                      type="text"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="e.g. Thabo M."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                  {reviewError && (
                    <p className="text-sm text-red-600">{reviewError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={reviewSubmitting || rating === 0}
                    className="w-full bg-[#007A4D] hover:bg-[#006040] disabled:bg-green-300 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    {reviewSubmitting ? "Submitting…" : "Submit Review"}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {job.status === "disputed" && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
            <h2 className="text-base font-semibold text-orange-800 mb-2">
              Concern submitted
            </h2>
            <p className="text-sm text-orange-700">
              Your concern has been submitted. SkillConnect admin will contact
              you within 24 hours.
            </p>
          </div>
        )}

        {job.status === "cancelled" && (
          <div className="bg-gray-100 border border-gray-200 rounded-xl p-5 text-center">
            <p className="text-sm text-gray-600">This job has been cancelled.</p>
          </div>
        )}

        <Timeline events={job.timeline} />
      </div>
    </div>
  );
}
