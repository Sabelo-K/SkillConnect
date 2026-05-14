"use client";
import { useState, useRef } from "react";
import { CheckCircle, ArrowLeft, HardHat, Camera, IdCard, Upload } from "lucide-react";
import Link from "next/link";
import { TRADES } from "@/lib/store";
import { Worker } from "@/lib/types";


// Compress an image file to a base64 JPEG, capped at maxWidth pixels
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
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas not supported"));
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

interface ImageUploadProps {
  label: string;
  hint: string;
  icon: React.ReactNode;
  preview: string;
  accept: string;
  onFile: (base64: string) => void;
}

function ImageUpload({ label, hint, icon, preview, accept, onFile }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError("File is too large. Please use a file under 10MB.");
      return;
    }
    setError("");
    try {
      // PDFs can't go through canvas — read directly as base64
      if (file.type === "application/pdf") {
        const reader = new FileReader();
        reader.onload = (e) => onFile(e.target?.result as string);
        reader.onerror = () => setError("Could not read the file. Please try another.");
        reader.readAsDataURL(file);
        return;
      }
      const maxWidth = label.toLowerCase().includes("selfie") ? 400 : 800;
      const compressed = await compressImage(file, maxWidth, 0.82);
      onFile(compressed);
    } catch {
      setError("Could not read the image. Please try another file.");
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label} *</label>
      <div
        onClick={() => inputRef.current?.click()}
        className="relative border-2 border-dashed border-gray-200 rounded-2xl p-4 cursor-pointer hover:border-orange-400 transition-colors group"
      >
        {preview ? (
          <div className="flex items-center gap-4">
            {preview.startsWith("data:application/pdf") ? (
              <div className="w-20 h-20 flex items-center justify-center bg-red-50 rounded-xl border border-gray-100">
                <span className="text-xs font-bold text-red-500">PDF</span>
              </div>
            ) : (
              <img src={preview} alt="preview" className="w-20 h-20 object-cover rounded-xl border border-gray-100" />
            )}
            <div>
              <p className="text-sm font-medium text-green-600">Uploaded ✓</p>
              <p className="text-xs text-gray-400 mt-0.5">Click to change</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-4 text-gray-400 group-hover:text-orange-500 transition-colors">
            <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-orange-50 transition-colors">
              {icon}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Click to upload</p>
              <p className="text-xs text-gray-400">{hint}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Upload className="w-3 h-3" /> JPG, PNG or PDF
            </div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleChange}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

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
  const [selfie, setSelfie] = useState("");
  const [idDocument, setIdDocument] = useState("");
  const [popiaConsent, setPopiaConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [registered, setRegistered] = useState<Worker | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selfie) { setError("Please upload a photo of yourself."); return; }
    if (!idDocument) { setError("Please upload a copy of your ID."); return; }
    if (!popiaConsent) { setError("Please accept the data protection consent to continue."); return; }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/workers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, photoUrl: selfie, idDocumentUrl: idDocument }),
      });
      if (!res.ok) throw new Error("Server error");
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
            Welcome to SkillConnect, <strong>{registered.name}</strong>. Your profile is now live and
            our team will verify your ID shortly.
          </p>
          <div className="bg-gray-50 rounded-2xl p-4 text-left mb-6">
            <div className="flex items-center gap-3">
              <img
                src={registered.photoUrl}
                alt={registered.name}
                className="w-14 h-14 rounded-full object-cover border border-gray-200"
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
          No formal certificate required. We just need a selfie, your ID, and details about your work.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-5">

        {/* Personal details */}
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

        {/* Photo uploads */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ImageUpload
            label="Selfie (profile photo)"
            hint="A clear photo of your face"
            icon={<Camera className="w-6 h-6" />}
            preview={selfie}
            accept="image/*"
            onFile={setSelfie}
          />
          <ImageUpload
            label="Copy of your ID"
            hint="SA ID book, smart card or passport"
            icon={<IdCard className="w-6 h-6" />}
            preview={idDocument}
            accept="image/*,application/pdf"
            onFile={setIdDocument}
          />
        </div>

        {/* Trade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trade / Skill *</label>
          <select
            required
            value={form.trade}
            onChange={(e) => setForm({ ...form, trade: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="">Select your trade...</option>
            {TRADES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Location */}
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
            <input
              required
              value={form.ward}
              onChange={(e) => setForm({ ...form, ward: e.target.value })}
              placeholder="e.g. Ward 4"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>

        {/* Experience */}
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

        {/* Bio */}
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

        {/* POPIA consent */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={popiaConsent}
            onChange={(e) => setPopiaConsent(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-orange-600 flex-shrink-0"
          />
          <span className="text-sm text-gray-600 leading-relaxed">
            I consent to SkillConnect collecting and storing my personal information (name, phone, photo,
            ID document) for the purpose of verifying my profile and connecting me with clients, in
            accordance with the{" "}
            <a href="/privacy" target="_blank" className="text-orange-600 underline">POPIA Privacy Policy</a>.
          </span>
        </label>

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
