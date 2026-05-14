import Link from "next/link";
import {
  ClipboardList, UserCheck, Star, ShieldCheck, Phone, Camera,
  IdCard, MapPin, Clock, ArrowRight, CheckCircle, AlertCircle,
} from "lucide-react";

export const metadata = {
  title: "How We Verify Workers — SkillConnect",
  description: "SkillConnect's worker verification process — how we vet, approve and tier every skilled worker on our platform.",
};

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Worker submits registration",
    duration: "5 minutes",
    color: "bg-orange-50 text-orange-600",
    details: [
      "Full name and mobile number",
      "Trade / skill and years of experience",
      "Residential area and ward in Chatsworth",
      "Short biography describing their work",
      "POPIA consent to data processing",
    ],
  },
  {
    icon: Camera,
    step: "02",
    title: "Photo and selfie upload",
    duration: "Instant",
    color: "bg-[#fffbea] text-[#b8860b]",
    details: [
      "A clear selfie is required for the public profile",
      "Photo must show the worker's face clearly",
      "Used to build community trust — clients see who is coming",
      "Image is compressed and stored securely",
    ],
  },
  {
    icon: IdCard,
    step: "03",
    title: "Identity document upload",
    duration: "Instant",
    color: "bg-[#eef1fb] text-[#002395]",
    details: [
      "South African ID, smart card, or passport",
      "Document is uploaded securely (never visible to clients)",
      "PDF or photo accepted",
      "Admin cross-checks name on ID against registration name",
    ],
  },
  {
    icon: MapPin,
    step: "04",
    title: "Locality confirmation",
    duration: "Admin review",
    color: "bg-[#e8f5ef] text-[#007A4D]",
    details: [
      "Worker's stated area and ward is noted",
      "SkillConnect's locality-first model prioritises workers in the same ward as the job",
      "Workers outside Chatsworth are accepted but ranked lower in matching",
    ],
  },
  {
    icon: UserCheck,
    step: "05",
    title: "Admin review and approval",
    duration: "Within 24 hours",
    color: "bg-orange-50 text-orange-600",
    details: [
      "SkillConnect admin reviews all submitted information",
      "ID document is verified against the provided name",
      "Profile photo is checked for clarity and appropriateness",
      "Worker is approved or rejected with a reason",
      "Rejected workers may resubmit with corrected documents",
    ],
  },
  {
    icon: ShieldCheck,
    step: "06",
    title: "Profile goes live",
    duration: "Immediate on approval",
    color: "bg-[#e8f5ef] text-[#007A4D]",
    details: [
      "Approved workers appear on the public worker directory",
      "Worker is assigned 'New' tier and becomes available for matching",
      "Clients can view profile, trade, area, and bio",
      "Worker begins receiving job matches",
    ],
  },
];

const tiers = [
  {
    name: "New",
    color: "bg-gray-100 text-gray-600",
    desc: "Verified identity, no completed jobs yet on the platform.",
    criteria: "Approved by admin with valid ID and photo.",
  },
  {
    name: "Verified",
    color: "bg-[#fffbea] text-[#b8860b]",
    desc: "Has completed at least 3 jobs with positive reviews.",
    criteria: "3+ completed jobs on SkillConnect with at least 3 reviews.",
  },
  {
    name: "Top Rated",
    color: "bg-[#e8f5ef] text-[#007A4D]",
    desc: "Consistently excellent — high volume, high rating.",
    criteria: "10+ completed jobs and an average rating of 4.5★ or above.",
  },
];

export default function HowWeVerifyPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#002395] to-[#001570] text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white text-sm px-4 py-1.5 rounded-full mb-6 font-medium">
            <ShieldCheck className="w-4 h-4" /> Verification Standard Operating Procedure
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
            How we verify<br />every worker
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Every worker on SkillConnect goes through a structured six-step verification process before
            they can be matched with a client. Here is exactly what we check and how.
          </p>
        </div>
      </section>

      {/* Principles */}
      <section className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-10 grid sm:grid-cols-3 gap-6">
          {[
            { icon: ShieldCheck, title: "Identity verified", desc: "Every worker's ID is checked against their registration name by a human admin.", color: "text-[#002395]", bg: "bg-[#eef1fb]" },
            { icon: MapPin, title: "Locality confirmed", desc: "Ward and area is recorded so our matching algorithm keeps money in the community.", color: "text-[#007A4D]", bg: "bg-[#e8f5ef]" },
            { icon: Star, title: "Performance tracked", desc: "Post-job ratings and reviews are collected from real clients to build a trusted track record.", color: "text-[#b8860b]", bg: "bg-[#fffbea]" },
          ].map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} className="flex gap-3">
              <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{title}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Step-by-step */}
      <section className="max-w-4xl mx-auto px-4 py-14 w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">The 6-step process</h2>
        <p className="text-gray-500 text-sm text-center mb-10">From registration to going live on the platform</p>
        <div className="space-y-5">
          {steps.map(({ icon: Icon, step, title, duration, color, details }) => (
            <div key={step} className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-4">
              <div className="flex-shrink-0 flex flex-col items-center gap-2">
                <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-gray-300">{step}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900">{title}</h3>
                  <span className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                    <Clock className="w-3 h-3" /> {duration}
                  </span>
                </div>
                <ul className="mt-2 space-y-1">
                  {details.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-3.5 h-3.5 text-[#007A4D] flex-shrink-0 mt-0.5" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Worker tiers */}
      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Worker tier system</h2>
          <p className="text-gray-500 text-sm text-center mb-8">Tiers are assigned automatically based on verified performance data</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {tiers.map(({ name, color, desc, criteria }) => (
              <div key={name} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${color}`}>{name}</span>
                <p className="mt-3 text-sm text-gray-700 leading-relaxed">{desc}</p>
                <p className="mt-2 text-xs text-gray-400 border-t border-gray-200 pt-2">{criteria}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rejection and appeals */}
      <section className="max-w-4xl mx-auto px-4 py-12 w-full">
        <div className="bg-orange-50 rounded-2xl border border-orange-100 p-6 flex gap-4">
          <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Rejection and resubmission</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Workers whose applications are rejected are notified via the contact number they provided.
              Common reasons include a blurry ID document, a photo that doesn&apos;t clearly show the face,
              or a name mismatch. Workers may correct and resubmit at any time. SkillConnect reserves
              the right to permanently ban workers who submit fraudulent documents.
            </p>
          </div>
        </div>
      </section>

      {/* Contact + CTA */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold mb-1">Questions about our process?</h2>
            <p className="text-gray-400 text-sm">
              Contact us on WhatsApp:{" "}
              <a href="tel:+27764880159" className="text-orange-400 font-medium">+27 76 488 0159</a>
              {" "}or{" "}
              <a href="mailto:skillconnect.cw@gmail.com" className="text-orange-400 font-medium">skillconnect.cw@gmail.com</a>
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link href="/register" className="bg-orange-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-orange-700 transition-colors flex items-center gap-2">
              Register as a worker <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/partner" className="border border-white text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-white/10 transition-colors">
              Partner with us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
