"use client";
import { useState } from "react";
import { Search, CheckCircle, Phone, MapPin, Star, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { TRADES } from "@/lib/store";
import { Worker } from "@/lib/types";

const WARDS = ["Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5", "Ward 6", "Ward 7", "Ward 8"];

export default function FindWorkerPage() {
  const [form, setForm] = useState({
    clientName: "",
    clientPhone: "",
    trade: "",
    ward: "",
    area: "Chatsworth",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ job: { id: string; status: string }; matchedWorker: Worker | null } | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
          <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Request submitted!</h2>

          {result.matchedWorker ? (
            <>
              <p className="text-gray-500 mb-6">
                Great news — we found an available worker in your area.
              </p>
              <div className="bg-orange-50 rounded-2xl p-5 text-left mb-6">
                <div className="flex items-center gap-4">
                  <img
                    src={result.matchedWorker.photoUrl}
                    alt={result.matchedWorker.name}
                    className="w-14 h-14 rounded-full bg-gray-100"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{result.matchedWorker.name}</p>
                    <p className="text-sm text-orange-600 font-medium">{result.matchedWorker.trade}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {result.matchedWorker.ward}
                      </span>
                      {result.matchedWorker.reviewCount > 0 && (
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {result.matchedWorker.rating.toFixed(1)} ({result.matchedWorker.reviewCount} reviews)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-orange-600" />
                  <a href={`tel:${result.matchedWorker.phone}`} className="text-orange-600 font-medium">
                    {result.matchedWorker.phone}
                  </a>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-6">
                Contact the worker directly to discuss the job, confirm timing and pricing.
              </p>
            </>
          ) : (
            <p className="text-gray-500 mb-6">
              We don&apos;t have an available worker in your ward right now, but we&apos;ll reach out to you as soon as one becomes available.
            </p>
          )}

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-orange-600 font-medium hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="text-sm text-gray-400 flex items-center gap-1 hover:text-gray-600 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find a skilled worker</h1>
        <p className="text-gray-500">
          Tell us what you need and we&apos;ll match you with the best available local worker.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Your name *</label>
            <input
              required
              value={form.clientName}
              onChange={(e) => setForm({ ...form, clientName: e.target.value })}
              placeholder="e.g. Mrs Naidoo"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone number *</label>
            <input
              required
              value={form.clientPhone}
              onChange={(e) => setForm({ ...form, clientPhone: e.target.value })}
              placeholder="+27 82 000 0000"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trade needed *</label>
          <select
            required
            value={form.trade}
            onChange={(e) => setForm({ ...form, trade: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="">Select a trade...</option>
            {TRADES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Area *</label>
            <input
              required
              value={form.area}
              onChange={(e) => setForm({ ...form, area: e.target.value })}
              placeholder="e.g. Chatsworth"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ward *</label>
            <select
              required
              value={form.ward}
              onChange={(e) => setForm({ ...form, ward: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="">Select ward...</option>
              {WARDS.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Describe the job *</label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="e.g. I have a burst pipe under the kitchen sink. Water is leaking onto the floor."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-orange-600 text-white font-semibold py-3 rounded-xl hover:bg-orange-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
        >
          {submitting ? "Finding worker..." : (
            <><Search className="w-4 h-4" /> Find me a worker</>
          )}
        </button>
      </form>
    </div>
  );
}
