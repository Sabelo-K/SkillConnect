"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const clientToken = searchParams.get("clientToken");
  const jobId = searchParams.get("jobId");
  const portalHref = clientToken ? `/job/client/${clientToken}` : jobId ? `/job/client/${jobId}` : null;

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-sm border border-green-100 p-8 max-w-sm w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✅</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment received!</h1>
        <p className="text-gray-500 text-sm mb-6">
          Thank you — your payment has been confirmed. SkillConnect will pay the
          worker once the job is fully settled. You&apos;ll receive a WhatsApp
          message shortly.
        </p>
        <div className="bg-green-50 rounded-2xl p-4 text-sm text-green-800 mb-6">
          <p className="font-medium">What happens next?</p>
          <p className="mt-1 text-green-700">
            We hold the funds securely and pay your worker after deducting our
            small commission. The worker will be notified.
          </p>
        </div>
        {portalHref && (
          <Link
            href={portalHref}
            className="block w-full bg-[#007A4D] text-white font-semibold py-3 rounded-xl text-sm hover:bg-[#006040] transition-colors mb-3"
          >
            Back to your job portal
          </Link>
        )}
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          Return to home
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
