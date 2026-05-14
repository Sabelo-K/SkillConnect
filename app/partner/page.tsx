"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Building2, Users, Heart, Phone, Mail, MessageSquare,
  CheckCircle, ArrowRight, Handshake,
} from "lucide-react";

const partnerTypes = [
  { value: "municipality", label: "Municipality / Government", icon: Building2 },
  { value: "ngo", label: "NGO / Non-profit", icon: Heart },
  { value: "community", label: "Community Organisation", icon: Users },
  { value: "corporate", label: "Corporate / Business", icon: Building2 },
  { value: "other", label: "Other", icon: MessageSquare },
];

const benefits = [
  {
    title: "Locality-first job creation",
    desc: "Our ward-based matching keeps employment income circulating within the same community, directly supporting local economic development mandates.",
  },
  {
    title: "Verified worker database",
    desc: "Every worker is identity-verified before going live. Organisations can refer community members knowing they'll enter a safe, structured platform.",
  },
  {
    title: "Transparent impact reporting",
    desc: "Real-time data on jobs facilitated, rand value of work, trades covered, and wards served — suitable for grant reporting and programme evaluations.",
  },
  {
    title: "Low barrier to entry",
    desc: "No formal qualifications required. Workers register with an ID and photos of their work. We meet people where they are.",
  },
];

export default function PartnerPage() {
  const [form, setForm] = useState({
    name: "", organisation: "", email: "", phone: "", type: "", message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const set = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.type) { setError("Please select a partnership type."); return; }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Something went wrong."); return; }
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-[#e8f5ef] rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-8 h-8 text-[#007A4D]" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Inquiry received!</h1>
        <p className="text-gray-500 mb-6">
          Thank you, <strong>{form.name}</strong>. We&apos;ll review your inquiry and get back to you
          within 2 business days at <strong>{form.email}</strong>.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          Need to reach us sooner? WhatsApp us at{" "}
          <a href="tel:+27764880159" className="text-orange-600 font-medium">+27 76 488 0159</a>.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/impact" className="bg-orange-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-orange-700 transition-colors">
            View our impact
          </Link>
          <Link href="/" className="border border-gray-200 text-gray-600 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#007A4D] to-[#005c39] text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-sm px-4 py-1.5 rounded-full mb-6 font-medium">
            <Handshake className="w-4 h-4" /> Partnership Enquiry
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
            Partner with<br />SkillConnect
          </h1>
          <p className="text-lg text-green-100 max-w-2xl mx-auto">
            We work with municipalities, NGOs, community organisations and corporates to scale local
            employment in Sweetwaters, Pietermaritzburg and beyond.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white border-b py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-8">Why partner with us?</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {benefits.map(({ title, desc }) => (
              <div key={title} className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-[#007A4D] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{title}</p>
                  <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-2xl mx-auto px-4 py-14 w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Submit a partnership inquiry</h2>
          <p className="text-gray-500 text-sm">We&apos;ll get back to you within 2 business days.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5">
          {/* Partnership type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Organisation type *</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {partnerTypes.map(({ value, label, icon: Icon }) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => set("type", value)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all text-left ${
                    form.type === value
                      ? "border-[#007A4D] bg-[#e8f5ef] text-[#007A4D]"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="leading-tight">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your name *</label>
              <input
                required type="text" value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Full name"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#007A4D]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organisation *</label>
              <input
                required type="text" value={form.organisation}
                onChange={(e) => set("organisation", e.target.value)}
                placeholder="e.g. eThekwini Municipality"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#007A4D]"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> Email address *
              </label>
              <input
                required type="email" value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="you@organisation.gov.za"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#007A4D]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> Phone / WhatsApp
              </label>
              <input
                type="tel" value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+27 XX XXX XXXX"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#007A4D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
            <textarea
              required rows={4} value={form.message}
              onChange={(e) => set("message", e.target.value)}
              placeholder="Tell us about your organisation, what you're hoping to achieve, and how you think we could work together..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#007A4D] resize-none"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#007A4D] text-white font-semibold py-3 rounded-xl hover:bg-[#005c39] disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? "Submitting..." : <><Handshake className="w-4 h-4" /> Submit inquiry <ArrowRight className="w-4 h-4" /></>}
          </button>

          <p className="text-xs text-gray-400 text-center">
            Prefer WhatsApp?{" "}
            <a
              href="https://wa.me/27764880159?text=Hi%20SkillConnect%2C%20I%27d%20like%20to%20discuss%20a%20partnership."
              target="_blank" rel="noopener noreferrer"
              className="text-[#007A4D] font-medium"
            >
              Message us directly on +27 76 488 0159
            </a>
          </p>
        </form>
      </section>

      {/* Supporting links */}
      <section className="bg-gray-50 border-t py-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm mb-4">Want to understand our platform before reaching out?</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/impact" className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 px-4 py-2 rounded-full hover:border-orange-200 transition-colors">
              View our impact data <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/how-we-verify" className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 px-4 py-2 rounded-full hover:border-orange-200 transition-colors">
              How we verify workers <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/workers" className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 px-4 py-2 rounded-full hover:border-orange-200 transition-colors">
              Browse our workers <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
