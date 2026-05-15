"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

function CancelContent() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-sm border border-orange-100 p-8 max-w-sm w-full text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">↩️</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment cancelled</h1>
        <p className="text-gray-500 text-sm mb-6">
          Your payment was cancelled. The job is still open — you can go back
          and try again when you&apos;re ready.
        </p>
        <p className="text-sm text-gray-400 mb-6">
          If you&apos;re having trouble paying, please contact us on WhatsApp
          and we&apos;ll help you sort it out.
        </p>
        {jobId && (
          <Link
            href={`/job/client/${jobId}`}
            className="block w-full bg-orange-600 text-white font-semibold py-3 rounded-xl text-sm hover:bg-orange-700 transition-colors mb-3"
          >
            Back to your job portal
          </Link>
        )}
        <a
          href="https://wa.me/27679467770"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full border border-gray-200 text-gray-600 font-medium py-3 rounded-xl text-sm hover:bg-gray-50 transition-colors"
        >
          Contact us on WhatsApp
        </a>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense>
      <CancelContent />
    </Suspense>
  );
}
