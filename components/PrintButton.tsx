"use client";
import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="print:hidden flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
    >
      <Printer className="w-4 h-4" /> Print / Save as PDF
    </button>
  );
}
