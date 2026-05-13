"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wrench, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Incorrect password. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 w-full max-w-sm">
        <div className="flex items-center gap-2 text-orange-600 font-bold text-xl mb-6">
          <Wrench className="w-5 h-5" /> SkillConnect Admin
        </div>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-orange-100 p-2.5 rounded-xl">
            <Lock className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900">Admin access</h1>
            <p className="text-xs text-gray-500">Enter your password to continue</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white font-semibold py-2.5 rounded-xl hover:bg-orange-700 disabled:opacity-60 transition-colors"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
