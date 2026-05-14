import Link from "next/link";
import {
  Wrench,
  Zap,
  Hammer,
  PaintBucket,
  Grid3X3,
  HardHat,
  MapPin,
  Star,
  ArrowRight,
  Users,
  TrendingUp,
  Shield,
  Quote,
  Briefcase,
} from "lucide-react";
import LocationBadge from "@/components/LocationBadge";

async function getLiveStats() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/api/impact`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) throw new Error();
    return res.json();
  } catch {
    return null;
  }
}

const trades = [
  { name: "Plumber", icon: Wrench, color: "bg-blue-50 text-blue-600" },
  { name: "Electrician", icon: Zap, color: "bg-yellow-50 text-yellow-600" },
  { name: "Carpenter", icon: Hammer, color: "bg-amber-50 text-amber-700" },
  { name: "Painter", icon: PaintBucket, color: "bg-purple-50 text-purple-600" },
  { name: "Tiler", icon: Grid3X3, color: "bg-teal-50 text-teal-600" },
  { name: "Builder", icon: HardHat, color: "bg-orange-50 text-orange-600" },
];

const clientSteps = [
  { step: "1", title: "Tell us what you need", desc: "Select the trade and describe the job — no long forms." },
  { step: "2", title: "Get matched instantly", desc: "Our locality-first algorithm finds the best available worker in your ward." },
  { step: "3", title: "Confirm and get it done", desc: "Review the worker's profile, confirm, and they come to you." },
];

const workerSteps = [
  { step: "1", title: "Register your skills", desc: "Share your trade, location, and photos of past work. No formal certificate needed." },
  { step: "2", title: "Get verified", desc: "We confirm your details and add you to the platform." },
  { step: "3", title: "Start earning", desc: "Clients in your area find and book you. You get paid directly — we take a small commission." },
];


const testimonials = [
  {
    quote: "I've been doing plumbing in Sweetwaters, Pietermaritzburg for 12 years but always struggled to find steady work. SkillConnect got me 3 jobs in my first week. Now clients call me directly because they trust the platform.",
    name: "Thabo M.",
    role: "Plumber · Ward 4, Sweetwaters, Pietermaritzburg",
    type: "worker",
  },
  {
    quote: "I needed an electrician urgently and didn't know who to trust. SkillConnect matched me with someone from my own street — he came within the hour. Honest pricing, great work.",
    name: "Priya N.",
    role: "Client · Sweetwaters, Pietermaritzburg",
    type: "client",
  },
  {
    quote: "As a carpenter I never had a way to show people my work. Now my profile does that for me. The reviews from real clients mean new customers already trust me before I arrive.",
    name: "Sipho D.",
    role: "Carpenter · Ward 6, Sweetwaters, Pietermaritzburg",
    type: "worker",
  },
];

export default async function Home() {
  const live = await getLiveStats();

  const stats = [
    {
      value: live ? `${live.totalWorkers}` : "—",
      label: "Verified workers",
      icon: Users,
    },
    {
      value: live ? `${live.completedJobs}` : "—",
      label: "Jobs completed",
      icon: Briefcase,
    },
    {
      value: live?.avgRating > 0 ? `${live.avgRating}★` : "—",
      label: "Average rating",
      icon: Star,
    },
    {
      value: "6–12%",
      label: "Commission only",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 flex flex-col items-center text-center">
          <LocationBadge />
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
            Local skills.<br />Local jobs.<br />Local money.
          </h1>
          <p className="text-lg md:text-xl text-orange-100 max-w-2xl mb-8">
            SkillConnect connects you with trusted, verified skilled workers right in your community —
            plumbers, electricians, carpenters, painters and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/find-worker"
              className="bg-white text-orange-600 font-semibold px-8 py-3 rounded-full hover:bg-orange-50 transition-colors flex items-center gap-2"
            >
              Find a Worker <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/register"
              className="border-2 border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition-colors"
            >
              Register as Worker
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center text-center gap-1">
              <Icon className="w-6 h-6 text-orange-500 mb-1" />
              <span className="text-2xl font-bold text-gray-900">{value}</span>
              <span className="text-sm text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Trades grid */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Trades we cover</h2>
        <p className="text-center text-gray-500 mb-8">Skilled workers across every major trade in your area</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {trades.map(({ name, icon: Icon, color }) => (
            <Link
              key={name}
              href={`/workers?trade=${name}`}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-gray-100 hover:border-orange-200 hover:shadow-sm transition-all"
            >
              <div className={`p-3 rounded-xl ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-gray-700">{name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works — two columns */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">How it works</h2>
          <div className="grid md:grid-cols-2 gap-10">
            {/* For clients */}
            <div className="bg-orange-50 rounded-3xl p-8">
              <h3 className="text-lg font-bold text-orange-700 mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5" /> For clients
              </h3>
              <div className="space-y-6">
                {clientSteps.map(({ step, title, desc }) => (
                  <div key={step} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {step}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{title}</p>
                      <p className="text-sm text-gray-500">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/find-worker"
                className="mt-8 inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-orange-700 transition-colors"
              >
                Request a worker <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* For workers */}
            <div className="bg-[#f0f7f4] rounded-3xl p-8">
              <h3 className="text-lg font-bold text-[#007A4D] mb-6 flex items-center gap-2">
                <HardHat className="w-5 h-5" /> For skilled workers
              </h3>
              <div className="space-y-6">
                {workerSteps.map(({ step, title, desc }) => (
                  <div key={step} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#007A4D] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {step}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{title}</p>
                      <p className="text-sm text-gray-500">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/register"
                className="mt-8 inline-flex items-center gap-2 bg-[#007A4D] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#005c39] transition-colors"
              >
                Register now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">Why choose SkillConnect?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: MapPin,
              title: "Locality-first matching",
              desc: "Workers from your own ward are always prioritised. Money stays in the community.",
              bg: "bg-[#f0f7f4]", fg: "text-[#007A4D]",
            },
            {
              icon: Shield,
              title: "Verified profiles",
              desc: "Every worker is verified with photos of their past work and proof of local residence.",
              bg: "bg-[#fffbea]", fg: "text-[#b8860b]",
            },
            {
              icon: Star,
              title: "Transparent ratings",
              desc: "Real reviews from your neighbours. You know who you're letting into your home.",
              bg: "bg-orange-50", fg: "text-orange-600",
            },
          ].map(({ icon: Icon, title, desc, bg, fg }) => (
            <div key={title} className="bg-white rounded-2xl border border-gray-100 p-6 flex gap-4">
              <div className={`p-3 ${bg} rounded-xl h-fit`}>
                <Icon className={`w-5 h-5 ${fg}`} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">What the community says</h2>
          <p className="text-center text-gray-500 mb-10 text-sm">Real voices from workers and clients in Sweetwaters, Pietermaritzburg</p>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ quote, name, role, type }) => (
              <div key={name} className="bg-gray-50 rounded-2xl p-6 flex flex-col gap-4 border border-gray-100">
                <Quote className={`w-6 h-6 flex-shrink-0 ${type === "worker" ? "text-[#007A4D]" : "text-orange-500"}`} />
                <p className="text-gray-700 text-sm leading-relaxed flex-1">&ldquo;{quote}&rdquo;</p>
                <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${type === "worker" ? "bg-[#007A4D]" : "bg-orange-500"}`}>
                    {name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{name}</p>
                    <p className="text-xs text-gray-400">{role}</p>
                  </div>
                  <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${type === "worker" ? "bg-[#e8f5ef] text-[#007A4D]" : "bg-orange-50 text-orange-600"}`}>
                    {type === "worker" ? "Worker" : "Client"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Ready to get started?</h2>
            <p className="text-gray-400">
              WhatsApp us at{" "}
              <a href="tel:+27679467770" className="text-orange-400 font-medium">
                +27 67 946 7770
              </a>{" "}
              or use the platform above.
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/find-worker"
              className="bg-orange-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-700 transition-colors"
            >
              Find a Worker
            </Link>
            <Link
              href="/register"
              className="border border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors"
            >
              I&apos;m a Worker
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
