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
      <ol className="relative border-l-2 border-amber-200 space-y-4 pl-5">
        {events.map((e, i) => (
          <li key={i} className="relative">
            <span className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-amber-400 border-2 border-white" />
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
    <div className="bg-white rounded-xl border border-amber-100 p-4 mb-6 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wide bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
          {job.trade}
        </span>
      </div>
      <div className="space-y-1 text-sm text-gray-700">
        <p><span className="font-medium">Client:</span> {job.clientName}</p>
        <p><span className="font-medium">Area:</span> {job.area}, Ward {job.ward}</p>
        <p><span className="font-medium">Description:</span> {job.description}</p>
        <p><span className="font-medium">Requested:</span> {formatTs(job.createdAt)}</p>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex justify-center items-center py-16">
      <div className="w-10 h-10 border-4 border-amber-300 border-t-amber-600 rounded-full animate-spin" />
    </div>
  );
}

export default function WorkerPortalPage({ params }: { params: Promise<{ token: string }> }) {
  const [token, setToken] = useState<string | null>(null);
  const [job, setJob] = useState<JobRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [quoteAmount, setQuoteAmount] = useState("");
  const [quoteScope, setQuoteScope] = useState("");
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const [quoteError, setQuoteError] = useState("");

  const [completionNotes, setCompletionNotes] = useState("");
  const [photo0, setPhoto0] = useState("");
  const [photo1, setPhoto1] = useState("");
  const [photo2, setPhoto2] = useState("");
  const [completionSubmitting, setCompletionSubmitting] = useState(false);
  const [completionError, setCompletionError] = useState("");

  useEffect(() => {
    params.then((p) => setToken(p.token));
  }, [params]);

  useEffect(() => {
    if (!token) return;
    fetch(`/api/job-by-token/${token}?role=worker`)
      .then(async (res) => {
        if (res.status === 404) { setNotFound(true); return; }
        const data = await res.json();
        setJob(data.job);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [token]);

  async function submitQuote(e: React.FormEvent) {
    e.preventDefault();
    if (!job) return;
    setQuoteSubmitting(true);
    setQuoteError("");
    try {
      const res = await fetch(`/api/jobs/${job.id}/quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quotedAmount: Number(quoteAmount), scopeNotes: quoteScope }),
      });
      if (!res.ok) { setQuoteError("Failed to submit quote. Please try again."); return; }
      const updated = await res.json();
      setJob(updated);
    } catch {
      setQuoteError("Network error. Please try again.");
    } finally {
      setQuoteSubmitting(false);
    }
  }

  async function submitCompletion(e: React.FormEvent) {
    e.preventDefault();
    if (!job) return;
    setCompletionSubmitting(true);
    setCompletionError("");
    const photos = [photo0, photo1, photo2].filter(Boolean);
    try {
      const res = await fetch(`/api/jobs/${job.id}/request-completion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completionNotes, completionPhotos: photos }),
      });
      if (!res.ok) { setCompletionError("Failed to submit. Please try again."); return; }
      const updated = await res.json();
      setJob(updated);
    } catch {
      setCompletionError("Network error. Please try again.");
    } finally {
      setCompletionSubmitting(false);
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-amber-50">
      <div className="max-w-lg mx-auto px-4 py-10"><Spinner /></div>
    </div>
  );

  if (notFound || !job) return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8 max-w-sm w-full text-center">
        <p className="text-2xl mb-2">🔗</p>
        <h1 className="text-lg font-semibold text-gray-800 mb-2">Invalid or expired link</h1>
        <p className="text-sm text-gray-500">This link is no longer valid. Please contact SkillConnect for help.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">SkillConnect</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Worker Portal</h1>
        </div>

        <JobCard job={job} />

        {job.status === "matched" && (
          <div className="bg-white rounded-xl border border-amber-100 shadow-sm p-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Submit your quote</h2>
            <form onSubmit={submitQuote} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agreed price (R)
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={quoteAmount}
                  onChange={(e) => setQuoteAmount(e.target.value)}
                  placeholder="e.g. 1500"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Describe the work you will do
                </label>
                <textarea
                  required
                  rows={4}
                  value={quoteScope}
                  onChange={(e) => setQuoteScope(e.target.value)}
                  placeholder="Describe the scope of work clearly..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                />
              </div>
              {quoteError && <p className="text-sm text-red-600">{quoteError}</p>}
              <button
                type="submit"
                disabled={quoteSubmitting}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {quoteSubmitting ? "Submitting…" : "Submit Quote"}
              </button>
            </form>
          </div>
        )}

        {job.status === "quoted" && (
          <div className="bg-white rounded-xl border border-amber-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-amber-500 text-xl">⏳</span>
              <h2 className="text-base font-semibold text-gray-800">Quote submitted</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">Waiting for the client to accept your quote.</p>
            <div className="bg-amber-50 rounded-lg p-3 space-y-2 text-sm">
              <p><span className="font-medium">Quoted amount:</span> R{job.quotedAmount?.toLocaleString()}</p>
              <p><span className="font-medium">Scope:</span> {job.scopeNotes}</p>
            </div>
          </div>
        )}

        {job.status === "accepted" && (
          <div className="bg-white rounded-xl border border-amber-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-green-500 text-xl">✅</span>
              <h2 className="text-base font-semibold text-gray-800">Quote accepted!</h2>
            </div>
            <p className="text-sm text-gray-600 mb-5">The client has accepted your quote. Time to get to work!</p>
            <form onSubmit={submitCompletion} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Describe the work completed
                </label>
                <textarea
                  required
                  rows={4}
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  placeholder="Describe what you did in detail..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Photos (optional)</label>
                {[
                  ["Before photo URL", photo0, setPhoto0],
                  ["After photo URL 1", photo1, setPhoto1],
                  ["After photo URL 2", photo2, setPhoto2],
                ].map(([label, value, setter]) => (
                  <input
                    key={label as string}
                    type="url"
                    value={value as string}
                    onChange={(e) => (setter as (v: string) => void)(e.target.value)}
                    placeholder={label as string}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                ))}
              </div>
              {completionError && <p className="text-sm text-red-600">{completionError}</p>}
              <button
                type="submit"
                disabled={completionSubmitting}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {completionSubmitting ? "Submitting…" : "Submit Completion"}
              </button>
            </form>
          </div>
        )}

        {job.status === "completion_requested" && (
          <div className="bg-white rounded-xl border border-amber-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-amber-500 text-xl">⏳</span>
              <h2 className="text-base font-semibold text-gray-800">Completion submitted</h2>
            </div>
            <p className="text-sm text-gray-600 mb-3">Waiting for the client to confirm.</p>
            {job.completionNotes && (
              <div className="bg-amber-50 rounded-lg p-3 text-sm">
                <p className="font-medium text-gray-700 mb-1">Your notes:</p>
                <p className="text-gray-600">{job.completionNotes}</p>
              </div>
            )}
          </div>
        )}

        {job.status === "completed" && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
            <p className="text-3xl mb-2">🎉</p>
            <h2 className="text-lg font-semibold text-green-800 mb-1">Job complete and confirmed!</h2>
            <p className="text-sm text-green-700 mb-3">Well done. The client has confirmed your work.</p>
            {job.quotedAmount && (
              <p className="text-base font-bold text-green-900">Agreed amount: R{job.quotedAmount.toLocaleString()}</p>
            )}
          </div>
        )}

        {job.status === "disputed" && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5">
            <h2 className="text-base font-semibold text-red-800 mb-2">Concern raised</h2>
            <p className="text-sm text-red-700">
              The client has raised a concern about this job. SkillConnect admin will contact you within 24 hours to resolve this.
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
