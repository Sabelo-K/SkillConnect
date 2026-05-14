"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Worker } from "@/lib/types";
import {
  ArrowLeft, MapPin, Star, Briefcase, Phone, CheckCircle, Shield, ExternalLink,
} from "lucide-react";
import Link from "next/link";

const tierBadge: Record<Worker["tier"], string> = {
  "New": "bg-gray-100 text-gray-600",
  "Verified": "bg-blue-100 text-blue-700",
  "Top Rated": "bg-orange-100 text-orange-700",
};

export default function WorkerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/workers`)
      .then((r) => r.json())
      .then((workers: Worker[]) => {
        const found = workers.find((w) => w.id === id);
        setWorker(found ?? null);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;
  if (!worker) return (
    <div className="text-center py-20">
      <p className="text-gray-500">Worker not found.</p>
      <Link href="/workers" className="text-orange-600 mt-2 inline-block">Back to directory</Link>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link href="/workers" className="text-sm text-gray-400 flex items-center gap-1 hover:text-gray-600 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to directory
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-orange-500 to-amber-400 p-8 flex items-center gap-5">
          <img
            src={worker.photoUrl}
            alt={worker.name}
            className="w-20 h-20 rounded-full bg-white/20"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-2xl font-bold text-white">{worker.name}</h1>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tierBadge[worker.tier]}`}>
                {worker.tier}
              </span>
            </div>
            <p className="text-orange-100 font-medium">{worker.trade}</p>
            <div className="flex items-center gap-1 text-orange-100 text-sm mt-1">
              <MapPin className="w-3.5 h-3.5" />
              {worker.area} · {worker.ward}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xl font-bold text-gray-900">{worker.jobsCompleted}</p>
              <p className="text-xs text-gray-500">Jobs done</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xl font-bold text-gray-900">{worker.yearsExperience}</p>
              <p className="text-xs text-gray-500">Yrs experience</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              {worker.reviewCount > 0 ? (
                <>
                  <p className="text-xl font-bold text-gray-900 flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {worker.rating.toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-500">{worker.reviewCount} reviews</p>
                </>
              ) : (
                <>
                  <p className="text-xl font-bold text-gray-400">—</p>
                  <p className="text-xs text-gray-500">No reviews yet</p>
                </>
              )}
            </div>
          </div>

          {/* Availability */}
          <div className={`flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl ${
            worker.available ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
          }`}>
            <div className={`w-2 h-2 rounded-full ${worker.available ? "bg-green-500" : "bg-red-400"}`} />
            {worker.available ? "Available for new jobs" : "Currently unavailable"}
          </div>

          {/* Bio */}
          <div>
            <h2 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-orange-500" /> About
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">{worker.bio}</p>
          </div>

          {/* TikTok */}
          {worker.tiktokUrl && (
            <a
              href={worker.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-black text-white rounded-xl px-4 py-3 text-sm font-medium hover:bg-gray-900 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.79 1.54V6.78a4.85 4.85 0 0 1-1.02-.09z"/>
              </svg>
              <span>Watch {worker.name.split(" ")[0]}&apos;s work on TikTok</span>
              <ExternalLink className="w-4 h-4 ml-auto opacity-60" />
            </a>
          )}

          {/* Trust */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Local worker — {worker.ward}, {worker.area}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Shield className="w-4 h-4 text-blue-500" />
              {worker.tier === "New" ? "Profile under review" : "Identity & work verified by SkillConnect"}
            </div>
          </div>

          {/* CTA */}
          {worker.available && (
            <a
              href={`tel:${worker.phone}`}
              className="flex items-center justify-center gap-2 w-full bg-orange-600 text-white font-semibold py-3 rounded-xl hover:bg-orange-700 transition-colors"
            >
              <Phone className="w-4 h-4" /> Contact {worker.name.split(" ")[0]}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
