"use client";
import { useState, useEffect, useRef } from "react";
import { Search, CheckCircle, Phone, MapPin, Star, ArrowLeft, Camera } from "lucide-react";
import Link from "next/link";
import { TRADES } from "@/lib/store";
import { Worker } from "@/lib/types";

async function compressImage(file: File, maxWidth: number, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}


interface NominatimResult {
  place_id: number;
  display_name: string;
  address: {
    road?: string;
    suburb?: string;
    quarter?: string;
    neighbourhood?: string;
    city_district?: string;
    city?: string;
    town?: string;
  };
}

function AddressAutocomplete({
  value,
  onChange,
  onSelect,
}: {
  value: string;
  onChange: (v: string) => void;
  onSelect: (display: string, suburb: string) => void;
}) {
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (value.length < 3) { setSuggestions([]); setOpen(false); return; }
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&addressdetails=1&countrycodes=za&limit=6`,
          { headers: { "Accept-Language": "en" } }
        );
        const data: NominatimResult[] = await res.json();
        setSuggestions(data);
        setOpen(data.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [value]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handlePick(result: NominatimResult) {
    const suburb =
      result.address.suburb ||
      result.address.quarter ||
      result.address.neighbourhood ||
      result.address.city_district ||
      result.address.town ||
      result.address.city ||
      "";
    // Trim the display name to the first 3 parts for brevity
    const short = result.display_name.split(",").slice(0, 3).join(",").trim();
    onSelect(short, suburb);
    setOpen(false);
    setSuggestions([]);
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder="e.g. 12 Main Road, Chatsworth"
          autoComplete="off"
          className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        {loading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 animate-pulse">
            Searching...
          </span>
        )}
      </div>
      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {suggestions.map((s) => (
            <li key={s.place_id}>
              <button
                type="button"
                onMouseDown={() => handlePick(s)}
                className="w-full text-left px-4 py-3 text-sm hover:bg-orange-50 border-b border-gray-50 last:border-0 leading-snug"
              >
                <span className="font-medium text-gray-800">
                  {s.display_name.split(",")[0]}
                </span>
                <span className="text-gray-400 text-xs block truncate">
                  {s.display_name.split(",").slice(1, 4).join(",")}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function FindWorkerPage() {
  const [form, setForm] = useState({
    clientName: "",
    clientPhone: "",
    trade: "",
    ward: "",
    area: "",
    description: "",
  });
  const [streetAddress, setStreetAddress] = useState("");
  const [jobPhoto, setJobPhoto] = useState("");
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ job: { id: string; status: string }; matchedWorker: Worker | null } | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const description = streetAddress
        ? `Address: ${streetAddress}\n\n${form.description}`
        : form.description;
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, description, photoUrl: jobPhoto }),
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Street address</label>
          <AddressAutocomplete
            value={streetAddress}
            onChange={setStreetAddress}
            onSelect={(display, suburb) => {
              setStreetAddress(display);
              if (suburb) setForm((f) => ({ ...f, area: suburb }));
            }}
          />
          <p className="text-xs text-gray-400 mt-1">Start typing to search — click a result to fill in automatically.</p>
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Area *</label>
          <input
            required
            value={form.area}
            onChange={(e) => setForm({ ...form, area: e.target.value })}
            placeholder="e.g. Chatsworth"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <p className="text-xs text-gray-400 mt-1">Auto-filled from your address, or type it in.</p>
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Photo of the problem (optional)</label>
          <div
            onClick={() => photoInputRef.current?.click()}
            className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-orange-400 transition-colors group"
          >
            {jobPhoto ? (
              <div className="flex items-center gap-4">
                <img src={jobPhoto} alt="Job photo" className="w-20 h-20 object-cover rounded-xl border border-gray-100" />
                <div>
                  <p className="text-sm font-medium text-green-600">Photo added ✓</p>
                  <p className="text-xs text-gray-400 mt-0.5">Click to change</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-gray-400 group-hover:text-orange-500 transition-colors">
                <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-orange-50 transition-colors">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Add a photo</p>
                  <p className="text-xs text-gray-400">Help the worker understand the problem</p>
                </div>
              </div>
            )}
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const compressed = await compressImage(file, 800, 0.8);
                setJobPhoto(compressed);
              }}
            />
          </div>
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
