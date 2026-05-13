"use client";
import { useEffect, useState, useCallback } from "react";
import { Worker, JobRequest } from "@/lib/types";
import {
  Users, ClipboardList, MapPin, Phone, Star, CheckCircle, Clock,
  X, Eye, IdCard, Briefcase, CircleDollarSign, TrendingUp, AlertCircle,
} from "lucide-react";

type Tab = "workers" | "jobs" | "commission";

// ── Worker profile modal ─────────────────────────────────────────────────────
function WorkerModal({ worker, onClose }: { worker: Worker; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-br from-orange-500 to-amber-400 p-6 rounded-t-3xl flex items-center gap-4">
          <img src={worker.photoUrl} alt={worker.name} className="w-16 h-16 rounded-full object-cover border-2 border-white/50 bg-white/20" />
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{worker.name}</h2>
            <p className="text-orange-100 text-sm">{worker.trade} · {worker.ward}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-lg font-bold text-gray-900">{worker.jobsCompleted}</p>
              <p className="text-xs text-gray-500">Jobs done</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-lg font-bold text-gray-900">{worker.yearsExperience} yrs</p>
              <p className="text-xs text-gray-500">Experience</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              {worker.reviewCount > 0 ? (
                <><p className="text-lg font-bold text-gray-900 flex items-center justify-center gap-1"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />{worker.rating.toFixed(1)}</p><p className="text-xs text-gray-500">{worker.reviewCount} reviews</p></>
              ) : (
                <><p className="text-lg font-bold text-gray-400">—</p><p className="text-xs text-gray-500">No reviews</p></>
              )}
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600"><Phone className="w-4 h-4 text-orange-500 flex-shrink-0" /><a href={`tel:${worker.phone}`} className="text-orange-600">{worker.phone}</a></div>
            <div className="flex items-center gap-2 text-gray-600"><MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />{worker.area} · {worker.ward}</div>
            <div className="flex items-start gap-2 text-gray-600"><Briefcase className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" /><p>{worker.bio}</p></div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${worker.available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{worker.available ? "Available" : "Unavailable"}</span>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${worker.tier === "Top Rated" ? "bg-orange-100 text-orange-700" : worker.tier === "Verified" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>{worker.tier}</span>
            <span className="text-xs px-3 py-1 rounded-full font-medium bg-gray-100 text-gray-500">Registered {worker.registeredAt}</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2"><IdCard className="w-4 h-4" /> ID Document</h3>
            {worker.idDocumentUrl ? (
              <div className="border border-gray-100 rounded-xl overflow-hidden"><img src={worker.idDocumentUrl} alt="ID Document" className="w-full object-contain max-h-60" /></div>
            ) : (
              <p className="text-sm text-gray-400 bg-gray-50 rounded-xl p-3">No ID document uploaded (demo worker).</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Complete job modal ───────────────────────────────────────────────────────
function CompleteJobModal({
  job, workers, onClose, onDone,
}: {
  job: JobRequest;
  workers: Worker[];
  onClose: () => void;
  onDone: (updated: JobRequest) => void;
}) {
  const [jobValue, setJobValue] = useState("");
  const [commissionRate, setCommissionRate] = useState("10");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const worker = workers.find((w) => w.id === job.matchedWorkerId);
  const preview = jobValue
    ? Math.round(Number(jobValue) * (Number(commissionRate) / 100))
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobValue || Number(jobValue) <= 0) { setError("Please enter a valid job value."); return; }
    setSaving(true);
    try {
      const res = await fetch(`/api/jobs/${job.id}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobValue: Number(jobValue), commissionRate: Number(commissionRate) }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      onDone(updated);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Mark job as complete</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          {/* Job summary */}
          <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-1">
            <p><span className="text-gray-500">Client:</span> <span className="font-medium">{job.clientName}</span> · {job.clientPhone}</p>
            <p><span className="text-gray-500">Trade:</span> <span className="font-medium">{job.trade}</span></p>
            {worker && <p><span className="text-gray-500">Worker:</span> <span className="font-medium">{worker.name}</span></p>}
            <p className="text-gray-500 text-xs mt-1 italic">{job.description}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job value (R) *</label>
              <input
                required
                type="number"
                min="1"
                value={jobValue}
                onChange={(e) => setJobValue(e.target.value)}
                placeholder="e.g. 850"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <p className="text-xs text-gray-400 mt-1">Amount the client paid the worker (including materials if applicable)</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Commission rate (%)</label>
              <select
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="6">6%</option>
                <option value="8">8%</option>
                <option value="10">10% (standard)</option>
                <option value="12">12%</option>
              </select>
            </div>

            {preview !== null && (
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Job value</span>
                  <span className="font-medium">R {Number(jobValue).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Commission ({commissionRate}%)</span>
                  <span className="font-bold text-orange-600">R {preview.toLocaleString()}</span>
                </div>
                <p className="text-xs text-orange-600 mt-2">
                  Send an EFT request to {worker?.name ?? "the worker"} for <strong>R {preview}</strong> via WhatsApp after marking complete.
                </p>
              </div>
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 disabled:opacity-60">
                {saving ? "Saving..." : "Mark Complete"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Main admin page ──────────────────────────────────────────────────────────
export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("jobs");
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [jobs, setJobs] = useState<JobRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [completingJob, setCompletingJob] = useState<JobRequest | null>(null);

  const refreshData = useCallback(() => {
    return Promise.all([
      fetch("/api/workers").then((r) => r.json()),
      fetch("/api/jobs").then((r) => r.json()),
    ]).then(([w, j]) => { setWorkers(w); setJobs(j); });
  }, []);

  useEffect(() => {
    refreshData().finally(() => setLoading(false));
  }, [refreshData]);

  const handleMarkCommissionPaid = async (jobId: string) => {
    await fetch(`/api/jobs/${jobId}/commission`, { method: "POST" });
    await refreshData();
  };

  const handleCompleteJobDone = async () => {
    setCompletingJob(null);
    await refreshData();
  };

  // Commission totals
  const completedJobs = jobs.filter((j) => j.status === "completed");
  const totalEarned = completedJobs.reduce((s, j) => s + (j.commissionAmount ?? 0), 0);
  const totalCollected = completedJobs.filter((j) => j.commissionStatus === "paid").reduce((s, j) => s + (j.commissionAmount ?? 0), 0);
  const totalOutstanding = completedJobs.filter((j) => j.commissionStatus === "awaiting").reduce((s, j) => s + (j.commissionAmount ?? 0), 0);

  const statusColor: Record<JobRequest["status"], string> = {
    pending: "bg-yellow-100 text-yellow-700",
    matched: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
  };
  const commissionColor: Record<JobRequest["commissionStatus"], string> = {
    none: "bg-gray-100 text-gray-400",
    awaiting: "bg-orange-100 text-orange-700",
    paid: "bg-green-100 text-green-700",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {selectedWorker && <WorkerModal worker={selectedWorker} onClose={() => setSelectedWorker(null)} />}
      {completingJob && (
        <CompleteJobModal
          job={completingJob}
          workers={workers}
          onClose={() => setCompletingJob(null)}
          onDone={handleCompleteJobDone}
        />
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
        <p className="text-gray-500">Manage workers, jobs and commission for SkillConnect.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <Users className="w-5 h-5 text-orange-500 mb-2" />
          <p className="text-2xl font-bold text-gray-900">{workers.length}</p>
          <p className="text-sm text-gray-500">Registered workers</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <ClipboardList className="w-5 h-5 text-blue-500 mb-2" />
          <p className="text-2xl font-bold text-gray-900">{jobs.filter((j) => j.status !== "completed").length}</p>
          <p className="text-sm text-gray-500">Active jobs</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <CircleDollarSign className="w-5 h-5 text-green-500 mb-2" />
          <p className="text-2xl font-bold text-gray-900">R {totalCollected.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Commission collected</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <AlertCircle className="w-5 h-5 text-orange-500 mb-2" />
          <p className="text-2xl font-bold text-gray-900">R {totalOutstanding.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Outstanding commission</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {(["jobs", "commission", "workers"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${
              tab === t ? "border-orange-600 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t === "jobs" ? `Jobs (${jobs.length})` : t === "commission" ? "Commission" : `Workers (${workers.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading...</div>
      ) : tab === "jobs" ? (
        /* ── Jobs tab ── */
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Client</th>
                <th className="px-4 py-3 text-left">Trade</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Worker</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Description</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {jobs.map((j) => {
                const worker = workers.find((w) => w.id === j.matchedWorkerId);
                return (
                  <tr key={j.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{j.clientName}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1"><Phone className="w-3 h-3" />{j.clientPhone}</p>
                    </td>
                    <td className="px-4 py-3 text-orange-600 font-medium">{j.trade}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {worker ? (
                        <div className="flex items-center gap-2">
                          <img src={worker.photoUrl} alt={worker.name} className="w-7 h-7 rounded-full object-cover bg-gray-100" />
                          <span className="text-gray-700">{worker.name}</span>
                        </div>
                      ) : <span className="text-gray-400">Unmatched</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden lg:table-cell max-w-xs">
                      <p className="truncate">{j.description}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColor[j.status]}`}>{j.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      {j.status !== "completed" ? (
                        <button
                          onClick={() => setCompletingJob(j)}
                          className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 font-medium"
                        >
                          Mark Complete
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">Done · {j.completedAt}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : tab === "commission" ? (
        /* ── Commission tab ── */
        <div className="space-y-6">
          {/* Totals */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
              <TrendingUp className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-gray-900">R {totalEarned.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-0.5">Total earned</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
              <CheckCircle className="w-5 h-5 text-green-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-green-600">R {totalCollected.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-0.5">Collected</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
              <Clock className="w-5 h-5 text-orange-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-orange-600">R {totalOutstanding.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-0.5">Outstanding</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Job</th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">Worker</th>
                  <th className="px-4 py-3 text-left">Job Value</th>
                  <th className="px-4 py-3 text-left">Commission</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {completedJobs.map((j) => {
                  const worker = workers.find((w) => w.id === j.matchedWorkerId);
                  return (
                    <tr key={j.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{j.clientName}</p>
                        <p className="text-xs text-gray-400">{j.trade} · {j.completedAt}</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        {worker ? (
                          <div className="flex items-center gap-2">
                            <img src={worker.photoUrl} alt={worker.name} className="w-7 h-7 rounded-full object-cover bg-gray-100" />
                            <div>
                              <p className="text-gray-700">{worker.name}</p>
                              <p className="text-xs text-gray-400">{worker.phone}</p>
                            </div>
                          </div>
                        ) : "—"}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        R {j.jobValue?.toLocaleString() ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-orange-600">R {j.commissionAmount?.toLocaleString() ?? "—"}</p>
                        <p className="text-xs text-gray-400">{j.commissionRate}%</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${commissionColor[j.commissionStatus]}`}>
                          {j.commissionStatus === "awaiting" ? "Awaiting payment" : j.commissionStatus === "paid" ? "Paid ✓" : "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {j.commissionStatus === "awaiting" && (
                          <button
                            onClick={() => handleMarkCommissionPaid(j.id)}
                            className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 font-medium"
                          >
                            Mark Paid
                          </button>
                        )}
                        {j.commissionStatus === "paid" && (
                          <span className="text-xs text-gray-400">Done</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {completedJobs.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">No completed jobs yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ── Workers tab ── */
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Worker</th>
                <th className="px-4 py-3 text-left">Trade</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Location</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Rating</th>
                <th className="px-4 py-3 text-left">Tier</th>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {workers.map((w) => (
                <tr key={w.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={w.photoUrl} alt={w.name} className="w-10 h-10 rounded-full object-cover bg-gray-100 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">{w.name}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1"><Phone className="w-3 h-3" />{w.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-orange-600 font-medium">{w.trade}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell"><span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{w.ward}</span></td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    {w.reviewCount > 0 ? <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{w.rating.toFixed(1)} ({w.reviewCount})</span> : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${w.tier === "Top Rated" ? "bg-orange-100 text-orange-700" : w.tier === "Verified" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>{w.tier}</span>
                  </td>
                  <td className="px-4 py-3">
                    {w.idDocumentUrl ? <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Uploaded</span> : <span className="text-xs bg-gray-100 text-gray-400 px-2 py-1 rounded-full">None</span>}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelectedWorker(w)} className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-800 font-medium">
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
