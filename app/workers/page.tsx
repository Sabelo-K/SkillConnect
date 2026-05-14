"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import WorkerCard from "@/components/WorkerCard";
import { Worker } from "@/lib/types";
import { TRADES } from "@/lib/store";
import { Users } from "lucide-react";

const ALL_WARDS = ["All", "Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5", "Ward 6", "Ward 7", "Ward 8"];

function WorkersContent() {
  const searchParams = useSearchParams();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [trade, setTrade] = useState(searchParams.get("trade") || "All");
  const [ward, setWard] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (trade !== "All") params.set("trade", trade);
    if (ward !== "All") params.set("ward", ward);
    fetch(`/api/workers?${params}`)
      .then((r) => r.json())
      .then((data) => { setWorkers(data); setLoading(false); });
  }, [trade, ward]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Worker directory</h1>
        <p className="text-gray-500">Browse verified skilled workers in Sweetwaters, Pietermaritzburg and surrounding areas.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Trade</label>
          <select
            value={trade}
            onChange={(e) => setTrade(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          >
            <option value="All">All trades</option>
            {TRADES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Ward</label>
          <select
            value={ward}
            onChange={(e) => setWard(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          >
            {ALL_WARDS.map((w) => <option key={w} value={w}>{w === "All" ? "All wards" : w}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading workers...</div>
      ) : workers.length === 0 ? (
        <div className="text-center py-20">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No workers found for this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {workers.map((w) => <WorkerCard key={w.id} worker={w} />)}
        </div>
      )}
    </div>
  );
}

export default function WorkersPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-400">Loading...</div>}>
      <WorkersContent />
    </Suspense>
  );
}
