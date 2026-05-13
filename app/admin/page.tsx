"use client";
import { useEffect, useState } from "react";
import { Worker, JobRequest } from "@/lib/types";
import { Users, ClipboardList, MapPin, Phone, Star, CheckCircle, Clock } from "lucide-react";

type Tab = "workers" | "jobs";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("workers");
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [jobs, setJobs] = useState<JobRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/workers").then((r) => r.json()),
      fetch("/api/jobs").then((r) => r.json()),
    ]).then(([w, j]) => {
      setWorkers(w);
      setJobs(j);
      setLoading(false);
    });
  }, []);

  const statusColor: Record<JobRequest["status"], string> = {
    pending: "bg-yellow-100 text-yellow-700",
    matched: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
        <p className="text-gray-500">Manage workers and job requests for SkillConnect.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <Users className="w-5 h-5 text-orange-500 mb-2" />
          <p className="text-2xl font-bold text-gray-900">{workers.length}</p>
          <p className="text-sm text-gray-500">Registered workers</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <CheckCircle className="w-5 h-5 text-green-500 mb-2" />
          <p className="text-2xl font-bold text-gray-900">{workers.filter((w) => w.available).length}</p>
          <p className="text-sm text-gray-500">Available now</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <ClipboardList className="w-5 h-5 text-blue-500 mb-2" />
          <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
          <p className="text-sm text-gray-500">Total job requests</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <Clock className="w-5 h-5 text-yellow-500 mb-2" />
          <p className="text-2xl font-bold text-gray-900">{jobs.filter((j) => j.status === "pending").length}</p>
          <p className="text-sm text-gray-500">Pending requests</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {(["workers", "jobs"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-3 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${
              tab === t
                ? "border-orange-600 text-orange-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t === "workers" ? `Workers (${workers.length})` : `Job Requests (${jobs.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading...</div>
      ) : tab === "workers" ? (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Worker</th>
                <th className="px-4 py-3 text-left">Trade</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Location</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Rating</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {workers.map((w) => (
                <tr key={w.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={w.photoUrl} alt={w.name} className="w-8 h-8 rounded-full bg-gray-100" />
                      <div>
                        <p className="font-medium text-gray-900">{w.name}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Phone className="w-3 h-3" />{w.phone}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-orange-600 font-medium">{w.trade}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />{w.ward}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    {w.reviewCount > 0 ? (
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {w.rating.toFixed(1)} ({w.reviewCount})
                      </span>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      w.available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {w.available ? "Available" : "Busy"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      w.tier === "Top Rated"
                        ? "bg-orange-100 text-orange-700"
                        : w.tier === "Verified"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {w.tier}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Client</th>
                <th className="px-4 py-3 text-left">Trade</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Location</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Description</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {jobs.map((j) => (
                <tr key={j.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{j.clientName}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Phone className="w-3 h-3" />{j.clientPhone}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-orange-600 font-medium">{j.trade}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />{j.ward}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden lg:table-cell max-w-xs">
                    <p className="truncate">{j.description}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColor[j.status]}`}>
                      {j.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{j.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
