"use client";
import { useState } from "react";
import { CheckCircle, ArrowLeft, HardHat } from "lucide-react";
import Link from "next/link";
import { TRADES } from "@/lib/store";
import { Worker } from "@/lib/types";

const WARDS = ["Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5", "Ward 6", "Ward 7", "Ward 8"];

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    trade: "",
    ward: "",
    area: "Chatsworth",
    yearsExperience: "",
    bio: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [registered, setRegistered] = useState<Worker | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/workers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setRegistered(data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (registered) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
          <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">You&apos;re registered!</h2>
          <p className="text-gray-500 mb-6">
            Welcome to SkillConnect, <strong>{registered.name}</strong>. Your profile is now live.
            Clients in your area will be able to find and contact you.
          </p>
          <div className="bg-gray-50 rounded-2xl p-4 text-left mb-6">
            <div className="flex items-center gap-3">
              <img
                src={registered.photoUrl}
                alt={registered.name}
                className="w-12 h-12 rounded-full bg-gray-200"
              />
              <div>
                <p className="font-semibold text-gray-900">{registered.name}</p>
                <p className="text-sm text-orange-600">{registered.trade}</p>
                <p className="text-xs text-gray-400">{registered.ward} · {registered.area}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href="/workers"
              className="bg-orange-600 text-white font-medium py-2.5 rounded-xl hover:bg-orange-700 transition-colors text-sm"
            >
              View worker directory
            </Link>
            <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back to home
            </Link>
          </div>
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
        <div className="flex items-center gap-3 mb-2">
          <HardHat className="w-7 h-7 text-orange-600" />
          <h1 className="text-3xl font-bold text-gray-900">Register as a worker</h1>
        </div>
        <p className="text-gray-500">
          No certificate required — just show us your trade and your work.
          Registration takes about 2 minutes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Thabo Nkosi"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp / Phone *</label>
            <input
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+27 82 000 0000"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trade / Skill *</label>
          <select
            required
            value={form.trade}
            onChange={(e) => setForm({ ...form, trade: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="">Select your trade...</option>
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
              <option value="">Select your ward...</option>
              {WARDS.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Years of experience *</label>
          <input
            required
            type="number"
            min="0"
            max="50"
            value={form.yearsExperience}
            onChange={(e) => setForm({ ...form, yearsExperience: e.target.value })}
            placeholder="e.g. 5"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tell us about your work *</label>
          <textarea
            required
            rows={4}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="Describe your skills, experience, and what kind of jobs you do best..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
          />
        </div>

        <div className="bg-orange-50 rounded-xl p-4 text-sm text-orange-700">
          <strong>No certificate needed.</strong> After registering, our team will contact you
          via WhatsApp to verify your details and photos of your work.
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-orange-600 text-white font-semibold py-3 rounded-xl hover:bg-orange-700 disabled:opacity-60 transition-colors"
        >
          {submitting ? "Registering..." : "Register as a worker"}
        </button>
      </form>
    </div>
  );
}
