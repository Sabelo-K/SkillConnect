"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Worker, JobRequest } from "@/lib/types";
import {
  Users, ClipboardList, MapPin, Phone, Star, CheckCircle, Clock,
  X, Eye, IdCard, Briefcase, CircleDollarSign, TrendingUp, AlertCircle,
  MessageCircle, ToggleLeft, ToggleRight, ClipboardCheck, LogOut,
} from "lucide-react";

type Tab = "workers" | "jobs" | "commission";

// ── Worker profile modal ─────────────────────────────────────────────────────
function WorkerModal({ worker, onClose }: { worker: Worker; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto overscroll-contain" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-br from-orange-500 to-amber-400 p-5 rounded-t-3xl flex items-center gap-4">
          <img src={worker.photoUrl} alt={worker.name} className="w-14 h-14 rounded-full object-cover border-2 border-white/50 bg-white/20 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-white truncate">{worker.name}</h2>
            <p className="text-orange-100 text-sm">{worker.trade} · {worker.ward}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-lg font-bold text-gray-900">{worker.jobsCompleted}</p>
              <p className="text-xs text-gray-500">Jobs done</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-lg font-bold text-gray-900">{worker.yearsExperience}y</p>
              <p className="text-xs text-gray-500">Experience</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              {worker.reviewCount > 0 ? (
                <><p className="text-lg font-bold text-gray-900 flex items-center justify-center gap-1"><Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />{worker.rating.toFixed(1)}</p><p className="text-xs text-gray-500">{worker.reviewCount} reviews</p></>
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
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${worker.available ? "bg-[#e8f5ef] text-[#007A4D]" : "bg-gray-100 text-gray-500"}`}>{worker.available ? "Available" : "Unavailable"}</span>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${worker.tier === "Top Rated" ? "bg-[#e8f5ef] text-[#007A4D]" : worker.tier === "Verified" ? "bg-[#fffbea] text-[#b8860b]" : "bg-gray-100 text-gray-600"}`}>{worker.tier}</span>
            <span className="text-xs px-3 py-1 rounded-full font-medium bg-gray-100 text-gray-500">Since {worker.registeredAt}</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2"><IdCard className="w-4 h-4" /> ID Document</h3>
            {worker.idDocumentUrl ? (
              <div className="border border-gray-100 rounded-xl overflow-hidden"><img src={worker.idDocumentUrl} alt="ID Document" className="w-full object-contain max-h-60" /></div>
            ) : (
              <p className="text-sm text-gray-400 bg-gray-50 rounded-xl p-3">No ID document uploaded.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Complete job modal ───────────────────────────────────────────────────────
function CompleteJobModal({ job, workers, onClose, onDone }: { job: JobRequest; workers: Worker[]; onClose: () => void; onDone: (updated: JobRequest) => void }) {
  const [jobValue, setJobValue] = useState("");
  const [commissionRate, setCommissionRate] = useState("10");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const worker = workers.find((w) => w.id === job.matchedWorkerId);
  const preview = jobValue ? Math.round(Number(jobValue) * (Number(commissionRate) / 100)) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobValue || Number(jobValue) <= 0) { setError("Please enter a valid job value."); return; }
    setSaving(true);
    try {
      const res = await fetch(`/api/jobs/${job.id}/complete`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jobValue: Number(jobValue), commissionRate: Number(commissionRate) }) });
      if (!res.ok) throw new Error();
      onDone(await res.json());
    } catch { setError("Something went wrong. Please try again."); }
    finally { setSaving(false); }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-xl w-full sm:max-w-md max-h-[92vh] overflow-y-auto overscroll-contain" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Mark job as complete</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-1">
            <p><span className="text-gray-500">Client:</span> <span className="font-medium">{job.clientName}</span> · {job.clientPhone}</p>
            <p><span className="text-gray-500">Trade:</span> <span className="font-medium">{job.trade}</span></p>
            {worker && <p><span className="text-gray-500">Worker:</span> <span className="font-medium">{worker.name}</span></p>}
            <p className="text-gray-500 text-xs mt-1 italic line-clamp-2">{job.description}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job value (R) *</label>
              <input required type="number" min="1" value={jobValue} onChange={(e) => setJobValue(e.target.value)} placeholder="e.g. 850" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              <p className="text-xs text-gray-400 mt-1">Amount the client paid the worker</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Commission rate (%)</label>
              <select value={commissionRate} onChange={(e) => setCommissionRate(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                <option value="6">6%</option><option value="8">8%</option><option value="10">10% (standard)</option><option value="12">12%</option>
              </select>
            </div>
            {preview !== null && (
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                <div className="flex justify-between text-sm"><span className="text-gray-600">Job value</span><span className="font-medium">R {Number(jobValue).toLocaleString()}</span></div>
                <div className="flex justify-between text-sm mt-1"><span className="text-gray-600">Commission ({commissionRate}%)</span><span className="font-bold text-orange-600">R {preview.toLocaleString()}</span></div>
                <p className="text-xs text-orange-600 mt-2">Request <strong>R {preview}</strong> from {worker?.name ?? "the worker"} via WhatsApp.</p>
              </div>
            )}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-medium">Cancel</button>
              <button type="submit" disabled={saving} className="flex-1 bg-[#007A4D] text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-60">{saving ? "Saving..." : "Mark Complete"}</button>
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
  const router = useRouter();

  const refreshData = useCallback(() =>
    Promise.all([
      fetch("/api/workers").then((r) => r.json()),
      fetch("/api/jobs").then((r) => r.json()),
    ]).then(([w, j]) => { setWorkers(w); setJobs(j); }), []);

  useEffect(() => { refreshData().finally(() => setLoading(false)); }, [refreshData]);

  const handleMarkCommissionPaid = async (jobId: string) => { await fetch(`/api/jobs/${jobId}/commission`, { method: "POST" }); await refreshData(); };
  const handleCompleteJobDone = async () => { setCompletingJob(null); await refreshData(); };
  const handleToggleAvailability = async (workerId: string) => { await fetch(`/api/workers/${workerId}/availability`, { method: "POST" }); await refreshData(); };

  const buildWhatsAppUrl = (job: JobRequest, worker: Worker) => {
    const phone = worker.phone.replace(/\s+/g, "").replace(/^\+/, "");
    return `https://wa.me/${phone}?text=${encodeURIComponent(`Hi ${worker.name} 👋\n\nYou have a new SkillConnect job!\n\n📋 Trade: ${job.trade}\n👤 Client: ${job.clientName}\n📞 Client phone: ${job.clientPhone}\n📍 Area: ${job.area}\n📝 Details: ${job.description}\n\nPlease confirm you can attend by replying. ✅`)}`;
  };

  const buildClientNotifyUrl = (job: JobRequest, worker: Worker) => {
    const phone = job.clientPhone.replace(/\s+/g, "").replace(/^\+/, "");
    return `https://wa.me/${phone}?text=${encodeURIComponent(`Hi ${job.clientName} 👋\n\nGreat news! We've found a worker for your SkillConnect request.\n\n🔧 Trade: ${job.trade}\n👷 Worker: ${worker.name}\n📞 Contact: ${worker.phone}\n\nPlease contact them directly to arrange a time. Thank you for using SkillConnect! 🙏`)}`;
  };

  const buildReviewUrl = (job: JobRequest) => {
    const reviewLink = `${typeof window !== "undefined" ? window.location.origin : ""}/review/${job.id}`;
    const phone = job.clientPhone.replace(/\s+/g, "").replace(/^\+/, "");
    return `https://wa.me/${phone}?text=${encodeURIComponent(`Hi ${job.clientName} 👋\n\nThank you for using SkillConnect! Please rate your experience:\n\n${reviewLink}\n\nYour review helps other community members. 🙏`)}`;
  };

  const completedJobs = jobs.filter((j) => j.status === "completed");
  const totalEarned = completedJobs.reduce((s, j) => s + (j.commissionAmount ?? 0), 0);
  const totalCollected = completedJobs.filter((j) => j.commissionStatus === "paid").reduce((s, j) => s + (j.commissionAmount ?? 0), 0);
  const totalOutstanding = completedJobs.filter((j) => j.commissionStatus === "awaiting").reduce((s, j) => s + (j.commissionAmount ?? 0), 0);

  const statusColor: Record<JobRequest["status"], string> = { pending: "bg-[#fffbea] text-[#b8860b]", matched: "bg-[#eef1fb] text-[#002395]", completed: "bg-[#e8f5ef] text-[#007A4D]" };
  const commissionColor: Record<JobRequest["commissionStatus"], string> = { none: "bg-gray-100 text-gray-400", awaiting: "bg-[#fffbea] text-[#b8860b]", paid: "bg-[#e8f5ef] text-[#007A4D]" };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
      {selectedWorker && <WorkerModal worker={selectedWorker} onClose={() => setSelectedWorker(null)} />}
      {completingJob && <CompleteJobModal job={completingJob} workers={workers} onClose={() => setCompletingJob(null)} onDone={handleCompleteJobDone} />}

      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">Admin</h1>
          <p className="text-gray-500 text-sm hidden sm:block">Manage workers, jobs and commission.</p>
        </div>
        <button
          onClick={async () => { await fetch("/api/admin/logout", { method: "POST" }); router.push("/admin/login"); }}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 px-3 py-2 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" /><span className="hidden sm:inline">Sign out</span>
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { icon: Users, color: "text-orange-500", value: workers.length, label: "Workers" },
          { icon: ClipboardList, color: "text-[#002395]", value: jobs.filter((j) => j.status !== "completed").length, label: "Active jobs" },
          { icon: CircleDollarSign, color: "text-[#007A4D]", value: `R ${totalCollected.toLocaleString()}`, label: "Collected" },
          { icon: AlertCircle, color: "text-orange-500", value: `R ${totalOutstanding.toLocaleString()}`, label: "Outstanding" },
        ].map(({ icon: Icon, color, value, label }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4">
            <Icon className={`w-4 h-4 ${color} mb-1.5`} />
            <p className="text-xl font-bold text-gray-900 leading-tight">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-5">
        {(["jobs", "commission", "workers"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 sm:flex-none px-3 sm:px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === t ? "border-orange-600 text-orange-600" : "border-transparent text-gray-500"}`}
          >
            {t === "jobs" ? `Jobs (${jobs.length})` : t === "commission" ? "Commission" : `Workers (${workers.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading...</div>
      ) : tab === "jobs" ? (
        /* ── Jobs tab — cards on mobile, table on desktop ── */
        <>
          {/* Mobile cards */}
          <div className="space-y-3 sm:hidden">
            {jobs.length === 0 && <p className="text-center py-10 text-gray-400 text-sm">No jobs yet.</p>}
            {jobs.map((j) => {
              const worker = workers.find((w) => w.id === j.matchedWorkerId);
              return (
                <div key={j.id} className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900">{j.clientName}</p>
                      <a href={`tel:${j.clientPhone}`} className="text-xs text-gray-400 flex items-center gap-1"><Phone className="w-3 h-3" />{j.clientPhone}</a>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize flex-shrink-0 ${statusColor[j.status]}`}>{j.status}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap text-sm">
                    <span className="font-medium text-orange-600">{j.trade}</span>
                    {worker && <span className="text-gray-500 flex items-center gap-1">· <img src={worker.photoUrl} alt={worker.name} className="w-5 h-5 rounded-full object-cover" /> {worker.name}</span>}
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2">{j.description}</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {j.status === "matched" && worker && (<>
                      <a href={buildWhatsAppUrl(j, worker)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs bg-[#007A4D] text-white px-3 py-2 rounded-xl font-medium"><MessageCircle className="w-3.5 h-3.5" /> Notify Worker</a>
                      <a href={buildClientNotifyUrl(j, worker)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs bg-[#002395] text-white px-3 py-2 rounded-xl font-medium"><MessageCircle className="w-3.5 h-3.5" /> Notify Client</a>
                    </>)}
                    {j.status !== "completed" ? (
                      <button onClick={() => setCompletingJob(j)} className="flex items-center gap-1 text-xs bg-orange-600 text-white px-3 py-2 rounded-xl font-medium"><CheckCircle className="w-3.5 h-3.5" /> Mark Complete</button>
                    ) : (
                      <a href={buildReviewUrl(j)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs bg-gray-700 text-white px-3 py-2 rounded-xl font-medium"><ClipboardCheck className="w-3.5 h-3.5" /> Request Review</a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Desktop table */}
          <div className="hidden sm:block bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Client</th>
                  <th className="px-4 py-3 text-left">Trade</th>
                  <th className="px-4 py-3 text-left">Worker</th>
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
                      <td className="px-4 py-3"><p className="font-medium text-gray-900">{j.clientName}</p><p className="text-xs text-gray-400 flex items-center gap-1"><Phone className="w-3 h-3" />{j.clientPhone}</p></td>
                      <td className="px-4 py-3 text-orange-600 font-medium">{j.trade}</td>
                      <td className="px-4 py-3">{worker ? <div className="flex items-center gap-2"><img src={worker.photoUrl} alt={worker.name} className="w-7 h-7 rounded-full object-cover bg-gray-100" /><span className="text-gray-700">{worker.name}</span></div> : <span className="text-gray-400">Unmatched</span>}</td>
                      <td className="px-4 py-3 text-gray-500 hidden lg:table-cell max-w-xs"><p className="truncate">{j.description}</p>{j.photoUrl && <a href={j.photoUrl} target="_blank" rel="noopener noreferrer"><img src={j.photoUrl} alt="Job photo" className="mt-1 w-12 h-12 object-cover rounded-lg border border-gray-100" /></a>}</td>
                      <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColor[j.status]}`}>{j.status}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1.5">
                          {j.status === "matched" && worker && (<>
                            <a href={buildWhatsAppUrl(j, worker)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs bg-[#007A4D] text-white px-2.5 py-1.5 rounded-lg font-medium w-fit"><MessageCircle className="w-3 h-3" /> Notify Worker</a>
                            <a href={buildClientNotifyUrl(j, worker)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs bg-[#002395] text-white px-2.5 py-1.5 rounded-lg font-medium w-fit"><MessageCircle className="w-3 h-3" /> Notify Client</a>
                          </>)}
                          {j.status !== "completed" ? (
                            <button onClick={() => setCompletingJob(j)} className="flex items-center gap-1 text-xs bg-orange-600 text-white px-2.5 py-1.5 rounded-lg font-medium w-fit"><CheckCircle className="w-3 h-3" /> Mark Complete</button>
                          ) : (
                            <a href={buildReviewUrl(j)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs bg-gray-700 text-white px-2.5 py-1.5 rounded-lg font-medium w-fit"><ClipboardCheck className="w-3 h-3" /> Request Review</a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : tab === "commission" ? (
        /* ── Commission tab ── */
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: TrendingUp, color: "text-[#002395]", value: `R ${totalEarned.toLocaleString()}`, label: "Total earned", textColor: "text-gray-900" },
              { icon: CheckCircle, color: "text-[#007A4D]", value: `R ${totalCollected.toLocaleString()}`, label: "Collected", textColor: "text-[#007A4D]" },
              { icon: Clock, color: "text-orange-500", value: `R ${totalOutstanding.toLocaleString()}`, label: "Outstanding", textColor: "text-orange-600" },
            ].map(({ icon: Icon, color, value, label, textColor }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 p-3 sm:p-5 text-center">
                <Icon className={`w-4 h-4 ${color} mx-auto mb-1`} />
                <p className={`text-base sm:text-xl font-bold ${textColor} leading-tight`}>{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 sm:hidden">
            {completedJobs.length === 0 && <p className="text-center py-10 text-gray-400 text-sm">No completed jobs yet.</p>}
            {completedJobs.map((j) => {
              const worker = workers.find((w) => w.id === j.matchedWorkerId);
              return (
                <div key={j.id} className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900">{j.clientName}</p>
                      <p className="text-xs text-gray-400">{j.trade} · {j.completedAt}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${commissionColor[j.commissionStatus]}`}>
                      {j.commissionStatus === "awaiting" ? "Awaiting" : j.commissionStatus === "paid" ? "Paid ✓" : "—"}
                    </span>
                  </div>
                  {worker && <p className="text-sm text-gray-600">Worker: <span className="font-medium">{worker.name}</span> · {worker.phone}</p>}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">Job value</p>
                      <p className="font-semibold text-gray-900">R {j.jobValue?.toLocaleString() ?? "—"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Commission ({j.commissionRate}%)</p>
                      <p className="font-bold text-orange-600">R {j.commissionAmount?.toLocaleString() ?? "—"}</p>
                    </div>
                  </div>
                  {j.commissionStatus === "awaiting" && (
                    <button onClick={() => handleMarkCommissionPaid(j.id)} className="w-full bg-[#007A4D] text-white py-2.5 rounded-xl text-sm font-semibold">Mark as Paid</button>
                  )}
                </div>
              );
            })}
          </div>
          {/* Desktop table */}
          <div className="hidden sm:block bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Job</th>
                  <th className="px-4 py-3 text-left">Worker</th>
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
                      <td className="px-4 py-3"><p className="font-medium text-gray-900">{j.clientName}</p><p className="text-xs text-gray-400">{j.trade} · {j.completedAt}</p></td>
                      <td className="px-4 py-3">{worker ? <div className="flex items-center gap-2"><img src={worker.photoUrl} alt={worker.name} className="w-7 h-7 rounded-full object-cover bg-gray-100" /><div><p className="text-gray-700">{worker.name}</p><p className="text-xs text-gray-400">{worker.phone}</p></div></div> : "—"}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">R {j.jobValue?.toLocaleString() ?? "—"}</td>
                      <td className="px-4 py-3"><p className="font-bold text-orange-600">R {j.commissionAmount?.toLocaleString() ?? "—"}</p><p className="text-xs text-gray-400">{j.commissionRate}%</p></td>
                      <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${commissionColor[j.commissionStatus]}`}>{j.commissionStatus === "awaiting" ? "Awaiting" : j.commissionStatus === "paid" ? "Paid ✓" : "—"}</span></td>
                      <td className="px-4 py-3">{j.commissionStatus === "awaiting" && <button onClick={() => handleMarkCommissionPaid(j.id)} className="text-xs bg-[#007A4D] text-white px-3 py-1.5 rounded-lg font-medium">Mark Paid</button>}{j.commissionStatus === "paid" && <span className="text-xs text-gray-400">Done</span>}</td>
                    </tr>
                  );
                })}
                {completedJobs.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">No completed jobs yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ── Workers tab — cards on mobile, table on desktop ── */
        <>
          {/* Mobile cards */}
          <div className="space-y-3 sm:hidden">
            {workers.length === 0 && <p className="text-center py-10 text-gray-400 text-sm">No workers yet.</p>}
            {workers.map((w) => (
              <div key={w.id} className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <img src={w.photoUrl} alt={w.name} className="w-12 h-12 rounded-full object-cover bg-gray-100 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900">{w.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${w.tier === "Top Rated" ? "bg-[#e8f5ef] text-[#007A4D]" : w.tier === "Verified" ? "bg-[#fffbea] text-[#b8860b]" : "bg-gray-100 text-gray-600"}`}>{w.tier}</span>
                    </div>
                    <p className="text-sm text-orange-600 font-medium">{w.trade}</p>
                    <a href={`tel:${w.phone}`} className="text-xs text-gray-400 flex items-center gap-1"><Phone className="w-3 h-3" />{w.phone}</a>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{w.area}</span>
                    {w.reviewCount > 0 && <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{w.rating.toFixed(1)}</span>}
                    {w.idDocumentUrl ? <span className="bg-[#e8f5ef] text-[#007A4D] px-2 py-0.5 rounded-full">ID ✓</span> : <span className="bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">No ID</span>}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                  <button onClick={() => handleToggleAvailability(w.id)} className="flex items-center gap-1.5 text-sm font-medium">
                    {w.available ? <><ToggleRight className="w-7 h-7 text-[#007A4D]" /><span className="text-[#007A4D]">Available</span></> : <><ToggleLeft className="w-7 h-7 text-gray-400" /><span className="text-gray-400">Unavailable</span></>}
                  </button>
                  <button onClick={() => setSelectedWorker(w)} className="flex items-center gap-1.5 text-sm text-orange-600 font-medium bg-orange-50 px-3 py-1.5 rounded-xl">
                    <Eye className="w-4 h-4" /> View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* Desktop table */}
          <div className="hidden sm:block bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Worker</th>
                  <th className="px-4 py-3 text-left">Trade</th>
                  <th className="px-4 py-3 text-left">Location</th>
                  <th className="px-4 py-3 text-left">Rating</th>
                  <th className="px-4 py-3 text-left">Tier</th>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Available</th>
                  <th className="px-4 py-3 text-left">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {workers.map((w) => (
                  <tr key={w.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3"><div className="flex items-center gap-3"><img src={w.photoUrl} alt={w.name} className="w-10 h-10 rounded-full object-cover bg-gray-100 flex-shrink-0" /><div><p className="font-medium text-gray-900">{w.name}</p><p className="text-xs text-gray-400 flex items-center gap-1"><Phone className="w-3 h-3" />{w.phone}</p></div></div></td>
                    <td className="px-4 py-3 text-orange-600 font-medium">{w.trade}</td>
                    <td className="px-4 py-3 text-gray-500"><span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{w.ward}</span></td>
                    <td className="px-4 py-3 text-gray-500">{w.reviewCount > 0 ? <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{w.rating.toFixed(1)} ({w.reviewCount})</span> : "—"}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${w.tier === "Top Rated" ? "bg-[#e8f5ef] text-[#007A4D]" : w.tier === "Verified" ? "bg-[#fffbea] text-[#b8860b]" : "bg-gray-100 text-gray-600"}`}>{w.tier}</span></td>
                    <td className="px-4 py-3">{w.idDocumentUrl ? <span className="text-xs bg-[#e8f5ef] text-[#007A4D] px-2 py-1 rounded-full font-medium">Uploaded</span> : <span className="text-xs bg-gray-100 text-gray-400 px-2 py-1 rounded-full">None</span>}</td>
                    <td className="px-4 py-3"><button onClick={() => handleToggleAvailability(w.id)} className="flex items-center gap-1.5 text-xs font-medium">{w.available ? <><ToggleRight className="w-6 h-6 text-[#007A4D]" /><span className="text-[#007A4D]">On</span></> : <><ToggleLeft className="w-6 h-6 text-gray-400" /><span className="text-gray-400">Off</span></>}</button></td>
                    <td className="px-4 py-3"><button onClick={() => setSelectedWorker(w)} className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-800 font-medium"><Eye className="w-3.5 h-3.5" /> View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
