"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Worker, JobRequest } from "@/lib/types";
import {
  Users, ClipboardList, MapPin, Phone, Star, CheckCircle, Clock,
  X, Eye, IdCard, Briefcase, CircleDollarSign, TrendingUp, AlertCircle,
  MessageCircle, ToggleLeft, ToggleRight, ClipboardCheck, LogOut, UserCheck, UserX, Handshake, Trash2,
  Link2, Copy, ShieldAlert,
} from "lucide-react";

type Tab = "workers" | "jobs" | "commission" | "approvals" | "partners" | "disputes";

interface PartnerInquiry {
  id: string;
  name: string;
  organisation: string;
  email: string;
  phone: string;
  type: string;
  message: string;
  created_at: string;
}

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

// ── Dispute resolution modal ─────────────────────────────────────────────────
function DisputeModal({ job, workers, onClose, onResolve }: { job: JobRequest; workers: Worker[]; onClose: () => void; onResolve: (jobId: string, resolution: string, outcome: "completed" | "cancelled") => void }) {
  const [resolution, setResolution] = useState("");
  const [outcome, setOutcome] = useState<"completed" | "cancelled">("completed");
  const [saving, setSaving] = useState(false);
  const worker = workers.find((w) => w.id === job.matchedWorkerId);
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-xl w-full sm:max-w-md max-h-[92vh] overflow-y-auto overscroll-contain" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-red-500" /><h2 className="text-lg font-bold text-gray-900">Resolve Dispute</h2></div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm space-y-1">
            <p><span className="text-gray-500">Client:</span> <span className="font-medium">{job.clientName}</span></p>
            {worker && <p><span className="text-gray-500">Worker:</span> <span className="font-medium">{worker.name}</span></p>}
            {job.disputeReason && <p className="text-red-600 mt-2 italic">&ldquo;{job.disputeReason}&rdquo;</p>}
          </div>
          {job.completionNotes && (
            <div className="bg-gray-50 rounded-xl p-4 text-sm">
              <p className="text-gray-500 text-xs mb-1">Worker&apos;s completion notes:</p>
              <p className="text-gray-700">{job.completionNotes}</p>
              {(job.completionPhotos ?? []).length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {(job.completionPhotos ?? []).map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-orange-600 underline">Photo {i + 1}</a>
                  ))}
                </div>
              )}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resolution note *</label>
            <textarea value={resolution} onChange={(e) => setResolution(e.target.value)} rows={3} placeholder="Describe how this dispute was resolved..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Outcome</label>
            <div className="flex gap-3">
              <button onClick={() => setOutcome("completed")} className={`flex-1 py-2.5 rounded-xl text-sm font-medium border-2 transition-colors ${outcome === "completed" ? "border-[#007A4D] bg-[#e8f5ef] text-[#007A4D]" : "border-gray-200 text-gray-500"}`}>Job completed</button>
              <button onClick={() => setOutcome("cancelled")} className={`flex-1 py-2.5 rounded-xl text-sm font-medium border-2 transition-colors ${outcome === "cancelled" ? "border-red-500 bg-red-50 text-red-600" : "border-gray-200 text-gray-500"}`}>Cancel job</button>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-medium">Cancel</button>
            <button disabled={!resolution.trim() || saving} onClick={async () => { setSaving(true); await onResolve(job.id, resolution, outcome); setSaving(false); }} className="flex-1 bg-orange-600 text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-60">{saving ? "Saving..." : "Resolve"}</button>
          </div>
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
  const [partners, setPartners] = useState<PartnerInquiry[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [jobLinks, setJobLinks] = useState<{ jobId: string; workerToken: string; clientToken: string } | null>(null);
  const [resolvingDispute, setResolvingDispute] = useState<JobRequest | null>(null);
  const router = useRouter();

  const refreshData = useCallback(() =>
    Promise.all([
      fetch("/api/workers?all=1").then((r) => r.json()),
      fetch("/api/jobs").then((r) => r.json()),
      fetch("/api/partner").then((r) => r.json()),
    ]).then(([w, j, p]) => { setWorkers(w); setJobs(j); setPartners(Array.isArray(p) ? p : []); }), []);

  useEffect(() => { refreshData().finally(() => setLoading(false)); }, [refreshData]);

  const handleGenerateLinks = async (jobId: string) => {
    const res = await fetch(`/api/jobs/${jobId}/tokens`, { method: "POST" });
    if (!res.ok) return;
    const { workerToken, clientToken } = await res.json();
    setJobLinks({ jobId, workerToken, clientToken });
    await refreshData();
  };

  const handleResolveDispute = async (jobId: string, resolution: string, outcome: "completed" | "cancelled") => {
    await fetch(`/api/jobs/${jobId}/resolve`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resolution, outcome }) });
    setResolvingDispute(null);
    await refreshData();
  };

  const handleDeleteWorker = async (workerId: string) => {
    await fetch(`/api/workers/${workerId}`, { method: "DELETE" });
    setConfirmDeleteId(null);
    await refreshData();
  };

  const handleWorkerStatus = async (workerId: string, status: "approved" | "rejected") => {
    await fetch(`/api/workers/${workerId}/status`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    await refreshData();
  };
  const handleMarkCommissionPaid = async (jobId: string) => { await fetch(`/api/jobs/${jobId}/commission`, { method: "POST" }); await refreshData(); };
  const handleCompleteJobDone = async () => { setCompletingJob(null); await refreshData(); };
  const handleToggleAvailability = async (workerId: string) => { await fetch(`/api/workers/${workerId}/availability`, { method: "POST" }); await refreshData(); };

  const origin = typeof window !== "undefined" ? window.location.origin : "https://skillconnect.vercel.app";

  const buildWhatsAppUrl = (job: JobRequest, worker: Worker) => {
    const phone = worker.phone.replace(/\s+/g, "").replace(/^\+/, "");
    const linkLine = job.workerToken ? `\n\n🔗 Your job portal: ${origin}/job/worker/${job.workerToken}` : "";
    return `https://wa.me/${phone}?text=${encodeURIComponent(`Hi ${worker.name} 👋\n\nYou have a new SkillConnect job!\n\n📋 Trade: ${job.trade}\n👤 Client: ${job.clientName}\n📞 Client phone: ${job.clientPhone}\n📍 Area: ${job.area}\n📝 Details: ${job.description}${linkLine}\n\nPlease confirm you can attend by replying. ✅`)}`;
  };

  const buildClientNotifyUrl = (job: JobRequest, worker: Worker) => {
    const phone = job.clientPhone.replace(/\s+/g, "").replace(/^\+/, "");
    const linkLine = job.clientToken ? `\n\n🔗 Track your job: ${origin}/job/client/${job.clientToken}` : "";
    return `https://wa.me/${phone}?text=${encodeURIComponent(`Hi ${job.clientName} 👋\n\nGreat news! We've found a worker for your SkillConnect request.\n\n🔧 Trade: ${job.trade}\n👷 Worker: ${worker.name}\n📞 Contact: ${worker.phone}${linkLine}\n\nPlease contact them directly to arrange a time. Thank you for using SkillConnect! 🙏`)}`;
  };

  const buildReviewUrl = (job: JobRequest) => {
    const reviewLink = `${typeof window !== "undefined" ? window.location.origin : ""}/review/${job.id}`;
    const phone = job.clientPhone.replace(/\s+/g, "").replace(/^\+/, "");
    return `https://wa.me/${phone}?text=${encodeURIComponent(`Hi ${job.clientName} 👋\n\nThank you for using SkillConnect! Please rate your experience:\n\n${reviewLink}\n\nYour review helps other community members. 🙏`)}`;
  };

  const approvedWorkers = workers.filter((w) => w.status === "approved");
  const pendingWorkers = workers.filter((w) => w.status === "pending");
  const completedJobs = jobs.filter((j) => j.status === "completed");
  const disputedJobs = jobs.filter((j) => j.status === "disputed");
  const totalEarned = completedJobs.reduce((s, j) => s + (j.commissionAmount ?? 0), 0);
  const totalCollected = completedJobs.filter((j) => j.commissionStatus === "paid").reduce((s, j) => s + (j.commissionAmount ?? 0), 0);
  const totalOutstanding = completedJobs.filter((j) => j.commissionStatus === "awaiting").reduce((s, j) => s + (j.commissionAmount ?? 0), 0);

  const statusColor: Record<JobRequest["status"], string> = { pending: "bg-[#fffbea] text-[#b8860b]", matched: "bg-[#eef1fb] text-[#002395]", quoted: "bg-[#eef1fb] text-[#5a2d82]", accepted: "bg-[#eef1fb] text-[#003580]", completion_requested: "bg-[#fffbea] text-[#b8860b]", completed: "bg-[#e8f5ef] text-[#007A4D]", disputed: "bg-[#fde8e8] text-[#c0392b]", cancelled: "bg-gray-100 text-gray-500" };
  const commissionColor: Record<JobRequest["commissionStatus"], string> = { none: "bg-gray-100 text-gray-400", awaiting: "bg-[#fffbea] text-[#b8860b]", paid: "bg-[#e8f5ef] text-[#007A4D]" };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
      {selectedWorker && <WorkerModal worker={selectedWorker} onClose={() => setSelectedWorker(null)} />}
      {completingJob && <CompleteJobModal job={completingJob} workers={workers} onClose={() => setCompletingJob(null)} onDone={handleCompleteJobDone} />}

      {/* Accountability links modal */}
      {jobLinks && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setJobLinks(null)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto overscroll-contain" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2"><Link2 className="w-5 h-5 text-orange-500" /><h2 className="text-lg font-bold text-gray-900">Accountability Links</h2></div>
              <button onClick={() => setJobLinks(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-gray-500">Share these links via WhatsApp. Each party can only see their own view.</p>
              {[
                { label: "Worker link", token: jobLinks.workerToken, path: "worker", color: "bg-[#007A4D]", desc: "Worker submits quote + completion evidence" },
                { label: "Client link", token: jobLinks.clientToken, path: "client", color: "bg-orange-600", desc: "Client reviews quote, confirms or disputes" },
              ].map(({ label, token, path, color, desc }) => {
                const url = `${origin}/job/${path}/${token}`;
                return (
                  <div key={path} className="bg-gray-50 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-gray-900 text-sm">{label}</p>
                      <span className="text-xs text-gray-400">{desc}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-600 truncate">{url}</code>
                      <button onClick={() => navigator.clipboard.writeText(url)} className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg flex-shrink-0 transition-colors" title="Copy link"><Copy className="w-4 h-4 text-gray-600" /></button>
                    </div>
                    <a href={`https://wa.me/?text=${encodeURIComponent(`Here is your SkillConnect job link:\n${url}`)}`} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-1.5 text-xs ${color} text-white px-3 py-2 rounded-xl font-medium w-fit`}>
                      <MessageCircle className="w-3.5 h-3.5" /> Send via WhatsApp
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Dispute resolution modal */}
      {resolvingDispute && <DisputeModal job={resolvingDispute} workers={workers} onClose={() => setResolvingDispute(null)} onResolve={handleResolveDispute} />}

      {/* Delete confirmation modal */}
      {confirmDeleteId && (() => {
        const w = workers.find((x) => x.id === confirmDeleteId);
        return (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setConfirmDeleteId(null)}>
            <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-xl w-full sm:max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-1">Remove worker?</h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                <strong>{w?.name}</strong> will be permanently removed from SkillConnect. This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDeleteId(null)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium">Cancel</button>
                <button onClick={() => handleDeleteWorker(confirmDeleteId)} className="flex-1 bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold">Remove</button>
              </div>
            </div>
          </div>
        );
      })()}

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
          { icon: Users, color: "text-orange-500", value: approvedWorkers.length, label: "Workers" },
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
      <div className="flex border-b border-gray-200 mb-5 overflow-x-auto">
        {(["jobs", "commission", "workers", "approvals", "partners", "disputes"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 sm:flex-none px-3 sm:px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap flex items-center justify-center gap-1.5 ${tab === t ? "border-orange-600 text-orange-600" : "border-transparent text-gray-500"}`}
          >
            {t === "jobs" ? `Jobs (${jobs.length})`
              : t === "commission" ? "Commission"
              : t === "workers" ? `Workers (${approvedWorkers.length})`
              : t === "partners" ? <span className="flex items-center gap-1.5">Partners {partners.length > 0 && <span className="bg-[#007A4D] text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">{partners.length}</span>}</span>
              : t === "disputes" ? <span className="flex items-center gap-1.5">Disputes {disputedJobs.length > 0 && <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">{disputedJobs.length}</span>}</span>
              : <span className="flex items-center gap-1.5">Approvals {pendingWorkers.length > 0 && <span className="bg-[#DE3831] text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">{pendingWorkers.length}</span>}</span>
            }
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
                    {j.matchedWorkerId && !j.workerToken && (
                      <button onClick={() => handleGenerateLinks(j.id)} className="flex items-center gap-1 text-xs bg-gray-800 text-white px-3 py-2 rounded-xl font-medium"><Link2 className="w-3.5 h-3.5" /> Generate Links</button>
                    )}
                    {j.workerToken && (
                      <button onClick={() => setJobLinks({ jobId: j.id, workerToken: j.workerToken!, clientToken: j.clientToken! })} className="flex items-center gap-1 text-xs bg-gray-800 text-white px-3 py-2 rounded-xl font-medium"><Link2 className="w-3.5 h-3.5" /> View Links</button>
                    )}
                    {j.status === "matched" && worker && (<>
                      <a href={buildWhatsAppUrl(j, worker)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs bg-[#007A4D] text-white px-3 py-2 rounded-xl font-medium"><MessageCircle className="w-3.5 h-3.5" /> Notify Worker</a>
                      <a href={buildClientNotifyUrl(j, worker)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs bg-[#002395] text-white px-3 py-2 rounded-xl font-medium"><MessageCircle className="w-3.5 h-3.5" /> Notify Client</a>
                    </>)}
                    {j.status !== "completed" && j.status !== "disputed" && j.status !== "cancelled" ? (
                      <button onClick={() => setCompletingJob(j)} className="flex items-center gap-1 text-xs bg-orange-600 text-white px-3 py-2 rounded-xl font-medium"><CheckCircle className="w-3.5 h-3.5" /> Mark Complete</button>
                    ) : j.status === "completed" ? (
                      <a href={buildReviewUrl(j)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs bg-gray-700 text-white px-3 py-2 rounded-xl font-medium"><ClipboardCheck className="w-3.5 h-3.5" /> Request Review</a>
                    ) : null}
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
                          {j.matchedWorkerId && !j.workerToken && (
                            <button onClick={() => handleGenerateLinks(j.id)} className="flex items-center gap-1 text-xs bg-gray-800 text-white px-2.5 py-1.5 rounded-lg font-medium w-fit"><Link2 className="w-3 h-3" /> Generate Links</button>
                          )}
                          {j.workerToken && (
                            <button onClick={() => setJobLinks({ jobId: j.id, workerToken: j.workerToken!, clientToken: j.clientToken! })} className="flex items-center gap-1 text-xs bg-gray-800 text-white px-2.5 py-1.5 rounded-lg font-medium w-fit"><Link2 className="w-3 h-3" /> View Links</button>
                          )}
                          {j.status === "matched" && worker && (<>
                            <a href={buildWhatsAppUrl(j, worker)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs bg-[#007A4D] text-white px-2.5 py-1.5 rounded-lg font-medium w-fit"><MessageCircle className="w-3 h-3" /> Notify Worker</a>
                            <a href={buildClientNotifyUrl(j, worker)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs bg-[#002395] text-white px-2.5 py-1.5 rounded-lg font-medium w-fit"><MessageCircle className="w-3 h-3" /> Notify Client</a>
                          </>)}
                          {j.status !== "completed" && j.status !== "disputed" && j.status !== "cancelled" ? (
                            <button onClick={() => setCompletingJob(j)} className="flex items-center gap-1 text-xs bg-orange-600 text-white px-2.5 py-1.5 rounded-lg font-medium w-fit"><CheckCircle className="w-3 h-3" /> Mark Complete</button>
                          ) : j.status === "completed" ? (
                            <a href={buildReviewUrl(j)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs bg-gray-700 text-white px-2.5 py-1.5 rounded-lg font-medium w-fit"><ClipboardCheck className="w-3 h-3" /> Request Review</a>
                          ) : null}
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
      ) : tab === "workers" ? (
        /* ── Workers tab — cards on mobile, table on desktop ── */
        <>
          {/* Mobile cards */}
          <div className="space-y-3 sm:hidden">
            {approvedWorkers.length === 0 && <p className="text-center py-10 text-gray-400 text-sm">No approved workers yet.</p>}
            {approvedWorkers.map((w) => (
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
                  <div className="flex items-center gap-2">
                    <button onClick={() => setSelectedWorker(w)} className="flex items-center gap-1.5 text-sm text-orange-600 font-medium bg-orange-50 px-3 py-1.5 rounded-xl">
                      <Eye className="w-4 h-4" /> View
                    </button>
                    <button onClick={() => setConfirmDeleteId(w.id)} className="flex items-center gap-1 text-xs text-red-500 border border-red-200 px-2.5 py-1.5 rounded-xl">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
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
                {approvedWorkers.map((w) => (
                  <tr key={w.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3"><div className="flex items-center gap-3"><img src={w.photoUrl} alt={w.name} className="w-10 h-10 rounded-full object-cover bg-gray-100 flex-shrink-0" /><div><p className="font-medium text-gray-900">{w.name}</p><p className="text-xs text-gray-400 flex items-center gap-1"><Phone className="w-3 h-3" />{w.phone}</p></div></div></td>
                    <td className="px-4 py-3 text-orange-600 font-medium">{w.trade}</td>
                    <td className="px-4 py-3 text-gray-500"><span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{w.ward}</span></td>
                    <td className="px-4 py-3 text-gray-500">{w.reviewCount > 0 ? <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{w.rating.toFixed(1)} ({w.reviewCount})</span> : "—"}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${w.tier === "Top Rated" ? "bg-[#e8f5ef] text-[#007A4D]" : w.tier === "Verified" ? "bg-[#fffbea] text-[#b8860b]" : "bg-gray-100 text-gray-600"}`}>{w.tier}</span></td>
                    <td className="px-4 py-3">{w.idDocumentUrl ? <span className="text-xs bg-[#e8f5ef] text-[#007A4D] px-2 py-1 rounded-full font-medium">Uploaded</span> : <span className="text-xs bg-gray-100 text-gray-400 px-2 py-1 rounded-full">None</span>}</td>
                    <td className="px-4 py-3"><button onClick={() => handleToggleAvailability(w.id)} className="flex items-center gap-1.5 text-xs font-medium">{w.available ? <><ToggleRight className="w-6 h-6 text-[#007A4D]" /><span className="text-[#007A4D]">On</span></> : <><ToggleLeft className="w-6 h-6 text-gray-400" /><span className="text-gray-400">Off</span></>}</button></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setSelectedWorker(w)} className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-800 font-medium"><Eye className="w-3.5 h-3.5" /> View</button>
                        <button onClick={() => setConfirmDeleteId(w.id)} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : tab === "approvals" ? (
        /* ── Approvals tab ── */
        <div className="space-y-3">
          {pendingWorkers.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <UserCheck className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="text-sm font-medium">No pending applications</p>
              <p className="text-xs mt-1">New worker registrations will appear here for review.</p>
            </div>
          )}
          {pendingWorkers.map((w) => (
            <div key={w.id} className="bg-white rounded-2xl border border-orange-100 p-4 space-y-3">
              <div className="flex items-start gap-3">
                <img src={w.photoUrl} alt={w.name} className="w-14 h-14 rounded-full object-cover bg-gray-100 flex-shrink-0 border-2 border-orange-200" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-900">{w.name}</p>
                    <span className="text-xs px-2 py-0.5 bg-[#fffbea] text-[#b8860b] rounded-full font-medium">Pending Review</span>
                  </div>
                  <p className="text-sm text-orange-600 font-medium">{w.trade}</p>
                  <a href={`tel:${w.phone}`} className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3" />{w.phone}</a>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{w.area} · {w.ward}</span>
                <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{w.yearsExperience} yrs experience</span>
              </div>
              <p className="text-xs text-gray-500 bg-gray-50 rounded-xl p-3 leading-relaxed">{w.bio}</p>
              {w.idDocumentUrl && (
                <div>
                  <p className="text-xs text-gray-500 mb-1.5 flex items-center gap-1"><IdCard className="w-3.5 h-3.5" /> ID Document</p>
                  <div className="border border-gray-100 rounded-xl overflow-hidden">
                    <img src={w.idDocumentUrl} alt="ID" className="w-full max-h-48 object-contain" />
                  </div>
                </div>
              )}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => handleWorkerStatus(w.id, "approved")}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-[#007A4D] text-white py-2.5 rounded-xl text-sm font-semibold"
                >
                  <UserCheck className="w-4 h-4" /> Approve
                </button>
                <button
                  onClick={() => handleWorkerStatus(w.id, "rejected")}
                  className="flex-1 flex items-center justify-center gap-1.5 border border-[#DE3831] text-[#DE3831] py-2.5 rounded-xl text-sm font-semibold"
                >
                  <UserX className="w-4 h-4" /> Reject
                </button>
                <button onClick={() => setSelectedWorker(w)} className="px-3 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium">
                  <Eye className="w-4 h-4" />
                </button>
                <button onClick={() => setConfirmDeleteId(w.id)} className="px-3 border border-red-200 text-red-400 py-2.5 rounded-xl text-sm font-medium">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : tab === "partners" ? (
        /* ── Partners tab ── */
        <div className="space-y-3">
          {partners.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <Handshake className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="text-sm font-medium">No partnership inquiries yet</p>
              <p className="text-xs mt-1">Submissions from /partner will appear here.</p>
            </div>
          )}
          {partners.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <p className="font-semibold text-gray-900">{p.name}</p>
                  <p className="text-sm text-orange-600 font-medium">{p.organisation}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-[#e8f5ef] text-[#007A4D] font-medium capitalize flex-shrink-0">{p.type}</span>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                {p.email && <a href={`mailto:${p.email}`} className="flex items-center gap-1 text-orange-600">{p.email}</a>}
                {p.phone && <a href={`tel:${p.phone}`} className="flex items-center gap-1 text-orange-600">{p.phone}</a>}
                <span className="text-gray-400">{new Date(p.created_at).toLocaleDateString("en-ZA")}</span>
              </div>
              <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3 leading-relaxed">{p.message}</p>
              <div className="flex gap-2">
                <a
                  href={`mailto:${p.email}?subject=SkillConnect%20Partnership%20Inquiry&body=Hi%20${encodeURIComponent(p.name)}%2C%0A%0AThank%20you%20for%20reaching%20out%20about%20a%20partnership%20with%20SkillConnect.`}
                  className="flex items-center gap-1.5 text-xs bg-[#007A4D] text-white px-3 py-2 rounded-xl font-medium"
                >
                  Reply via Email
                </a>
                {p.phone && (
                  <a
                    href={`https://wa.me/${p.phone.replace(/\s+/g, "").replace(/^\+/, "")}?text=${encodeURIComponent(`Hi ${p.name} 👋\n\nThank you for your partnership inquiry with SkillConnect. We'd love to connect and discuss further.\n\nBest regards,\nSkillConnect Team`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs bg-[#002395] text-white px-3 py-2 rounded-xl font-medium"
                  >
                    Reply via WhatsApp
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ── Disputes tab ── */
        <div className="space-y-4">
          {disputedJobs.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <ShieldAlert className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="text-sm font-medium">No active disputes</p>
              <p className="text-xs mt-1">Disputes raised by clients or workers will appear here for resolution.</p>
            </div>
          ) : (
            disputedJobs.map((j) => {
              const worker = workers.find((w) => w.id === j.matchedWorkerId);
              return (
                <div key={j.id} className="bg-white border-2 border-red-100 rounded-2xl p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <ShieldAlert className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <p className="font-semibold text-gray-900">{j.trade} · {j.clientName}</p>
                      </div>
                      <p className="text-xs text-gray-400">{j.area} · {new Date(j.createdAt).toLocaleDateString("en-ZA")}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-600 font-medium flex-shrink-0">Disputed</span>
                  </div>

                  {/* Parties */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="bg-orange-50 rounded-xl p-3 text-sm">
                      <p className="text-xs text-gray-400 mb-0.5">Client</p>
                      <p className="font-medium text-gray-900">{j.clientName}</p>
                      <a href={`tel:${j.clientPhone}`} className="text-xs text-orange-600">{j.clientPhone}</a>
                    </div>
                    {worker && (
                      <div className="bg-[#f0f7f4] rounded-xl p-3 text-sm">
                        <p className="text-xs text-gray-400 mb-0.5">Worker</p>
                        <div className="flex items-center gap-2">
                          <img src={worker.photoUrl} alt={worker.name} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <p className="font-medium text-gray-900">{worker.name}</p>
                            <a href={`tel:${worker.phone}`} className="text-xs text-[#007A4D]">{worker.phone}</a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dispute reason */}
                  {j.disputeReason && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                      <p className="text-xs text-red-400 mb-1 font-medium">Client&apos;s concern</p>
                      <p className="text-sm text-red-700">&ldquo;{j.disputeReason}&rdquo;</p>
                    </div>
                  )}

                  {/* Completion evidence */}
                  {j.completionNotes && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-400 mb-1 font-medium">Worker&apos;s completion claim</p>
                      <p className="text-sm text-gray-700">{j.completionNotes}</p>
                      {(j.completionPhotos ?? []).filter(Boolean).length > 0 && (
                        <div className="flex gap-3 mt-3 flex-wrap">
                          {(j.completionPhotos ?? []).filter(Boolean).map((url, i) => (
                            <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                              <img src={url} alt={`Photo ${i + 1}`} className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Timeline preview */}
                  {(j.timeline ?? []).length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Audit trail</p>
                      {(j.timeline ?? []).map((e, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-gray-500">
                          <span className="text-gray-300 flex-shrink-0 mt-0.5">·</span>
                          <span className="font-medium capitalize">{e.by}</span>
                          <span className="text-gray-400">{new Date(e.at).toLocaleDateString("en-ZA", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                          {e.note && <span className="text-gray-500 italic truncate">{e.note}</span>}
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => setResolvingDispute(j)}
                    className="w-full bg-orange-600 text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <ShieldAlert className="w-4 h-4" /> Resolve this dispute
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
