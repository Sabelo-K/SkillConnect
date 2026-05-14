"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Wrench } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-orange-600">
          <Wrench className="w-6 h-6" />
          SkillConnect
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/workers" className="hover:text-orange-600 transition-colors">
            Find Workers
          </Link>
          <Link href="/find-worker" className="hover:text-orange-600 transition-colors">
            Request a Job
          </Link>
          <Link href="/impact" className="hover:text-orange-600 transition-colors">
            Our Impact
          </Link>
          <Link href="/partner" className="hover:text-orange-600 transition-colors">
            Partner
          </Link>
          <Link href="/admin" className="hover:text-orange-600 transition-colors">
            Admin
          </Link>
          <Link
            href="/register"
            className="bg-orange-600 text-white px-4 py-2 rounded-full hover:bg-orange-700 transition-colors"
          >
            Register as Worker
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t px-4 py-3 flex flex-col gap-3 text-sm font-medium text-gray-700">
          <Link href="/workers" onClick={() => setOpen(false)}>Find Workers</Link>
          <Link href="/find-worker" onClick={() => setOpen(false)}>Request a Job</Link>
          <Link href="/impact" onClick={() => setOpen(false)}>Our Impact</Link>
          <Link href="/partner" onClick={() => setOpen(false)}>Partner with Us</Link>
          <Link href="/admin" onClick={() => setOpen(false)}>Admin</Link>
          <Link
            href="/register"
            onClick={() => setOpen(false)}
            className="bg-orange-600 text-white px-4 py-2 rounded-full text-center"
          >
            Register as Worker
          </Link>
        </div>
      )}
    </nav>
  );
}
