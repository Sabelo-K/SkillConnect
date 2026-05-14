import Link from "next/link";
import {
  Users, Briefcase, TrendingUp, Star, MapPin, Wrench,
  ArrowRight, CheckCircle, Heart, Phone, Mail,
} from "lucide-react";
import PrintButton from "@/components/PrintButton";

interface ImpactData {
  totalWorkers: number;
  totalJobs: number;
  completedJobs: number;
  totalRandValue: number;
  totalCommission: number;
  avgRating: number;
  tradesCount: number;
  trades: string[];
  wardsCount: number;
  areasCount: number;
}

async function getImpactData(): Promise<ImpactData> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/api/impact`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error();
    return res.json();
  } catch {
    return {
      totalWorkers: 0, totalJobs: 0, completedJobs: 0,
      totalRandValue: 0, totalCommission: 0, avgRating: 0,
      tradesCount: 0, trades: [], wardsCount: 0, areasCount: 0,
    };
  }
}

export const metadata = {
  title: "Our Impact — SkillConnect",
  description: "See how SkillConnect is building local economies in Chatsworth, Durban by connecting skilled workers with community members.",
};

export default async function ImpactPage() {
  const data = await getImpactData();
  const generated = new Date().toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" });

  const stats = [
    { icon: Users, value: data.totalWorkers, label: "Verified workers", desc: "Skilled locals on the platform", bg: "bg-orange-50", fg: "text-orange-600" },
    { icon: Briefcase, value: data.completedJobs, label: "Jobs completed", desc: "Successfully matched and finished", bg: "bg-[#e8f5ef]", fg: "text-[#007A4D]" },
    { icon: TrendingUp, value: `R ${data.totalRandValue.toLocaleString()}`, label: "Rand value facilitated", desc: "Real money earned by workers", bg: "bg-[#fffbea]", fg: "text-[#b8860b]" },
    { icon: Star, value: data.avgRating > 0 ? `${data.avgRating}★` : "—", label: "Average worker rating", desc: "Based on verified community reviews", bg: "bg-[#eef1fb]", fg: "text-[#002395]" },
    { icon: Wrench, value: data.tradesCount, label: "Trades covered", desc: "From plumbing to welding", bg: "bg-orange-50", fg: "text-orange-600" },
    { icon: MapPin, value: data.wardsCount || data.areasCount, label: "Wards / areas served", desc: "Locality-first matching", bg: "bg-[#e8f5ef]", fg: "text-[#007A4D]" },
  ];

  return (
    <div className="flex flex-col">
      {/* Print header — only visible when printing */}
      <div className="hidden print:flex items-center justify-between px-8 pt-8 pb-4 border-b-2 border-gray-200">
        <div className="flex items-center gap-3">
          {/* SA flag stripe */}
          <div className="flex flex-col gap-0.5">
            <div className="w-4 h-1 bg-[#007A4D]" />
            <div className="w-4 h-1 bg-[#FFB612]" />
            <div className="w-4 h-1 bg-[#DE3831]" />
            <div className="w-4 h-1 bg-[#002395]" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-orange-600">SkillConnect</p>
            <p className="text-xs text-gray-500">Local skills. Local jobs. Local money.</p>
          </div>
        </div>
        <div className="text-right text-xs text-gray-400">
          <p>Impact Report</p>
          <p>Generated: {generated}</p>
          <p>Chatsworth, Durban, KZN</p>
        </div>
      </div>

      {/* Hero — hidden on print */}
      <section className="print:hidden bg-gradient-to-br from-[#007A4D] via-[#007A4D] to-[#005c39] text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white text-sm px-4 py-1.5 rounded-full mb-6 font-medium">
            <Heart className="w-4 h-4 fill-white" /> Building local economies
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
            Our impact in<br />Chatsworth, Durban
          </h1>
          <p className="text-lg text-green-100 max-w-2xl mx-auto">
            SkillConnect is keeping money in the community by connecting skilled local workers
            with the people who need them — ward by ward.
          </p>
        </div>
      </section>

      {/* Print page title */}
      <div className="hidden print:block px-8 py-6">
        <h1 className="text-3xl font-extrabold text-gray-900">Impact Report — Chatsworth, Durban</h1>
        <p className="text-gray-500 mt-1 text-sm">SkillConnect is a locality-first labour marketplace connecting verified skilled workers with community members in Chatsworth, KwaZulu-Natal.</p>
      </div>

      {/* Print / Save button */}
      <div className="print:hidden max-w-5xl mx-auto px-4 pt-8 w-full flex justify-end">
        <PrintButton />
      </div>

      {/* Stats grid */}
      <section className="max-w-5xl mx-auto px-4 py-8 print:py-4 print:px-8 w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stats.map(({ icon: Icon, value, label, desc, bg, fg }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3 print:rounded-lg print:p-4">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center flex-shrink-0 print:w-8 print:h-8`}>
                <Icon className={`w-5 h-5 ${fg} print:w-4 print:h-4`} />
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight print:text-2xl">{value}</p>
                <p className="text-sm font-semibold text-gray-700 mt-0.5">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trades covered */}
      {data.trades.length > 0 && (
        <section className="bg-white py-10 print:py-4 print:px-8">
          <div className="max-w-5xl mx-auto px-4 print:px-0">
            <h2 className="text-xl font-bold text-gray-900 mb-4 print:text-base">Trades we cover</h2>
            <div className="flex flex-wrap gap-2">
              {data.trades.map((trade) => (
                <span
                  key={trade}
                  className="print:hidden flex items-center gap-2 bg-gray-50 border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all px-4 py-2 rounded-full text-sm font-medium text-gray-700"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-[#007A4D]" /> {trade}
                </span>
              ))}
              {/* Print-only inline list */}
              <p className="hidden print:block text-sm text-gray-700">
                {data.trades.join(" · ")}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Mission statement */}
      <section className="max-w-5xl mx-auto px-4 py-14 print:py-6 print:px-8 w-full">
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-8 md:p-10 print:rounded-lg print:p-5 print:bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 print:text-lg">Our mission</h2>
          <p className="text-gray-600 leading-relaxed mb-3 print:text-sm">
            South Africa has millions of skilled workers who struggle to find consistent, dignified work —
            not because they lack skill, but because they lack visibility. SkillConnect changes that.
          </p>
          <p className="text-gray-600 leading-relaxed mb-3 print:text-sm">
            By using a locality-first matching model, we ensure that when someone in Ward 4 needs a
            plumber, the first call goes to a plumber who lives in Ward 4. Money stays in the community.
            Trust is built between neighbours. Local economies grow.
          </p>
          <p className="text-gray-600 leading-relaxed print:text-sm">
            We verify every worker, collect honest reviews, and take a small commission only when a job
            is completed — so our incentives are perfectly aligned with the community we serve.
          </p>
        </div>
      </section>

      {/* Print contact footer */}
      <div className="hidden print:block px-8 py-6 border-t-2 border-gray-200 mt-4">
        <h3 className="font-bold text-gray-900 mb-2">Contact us</h3>
        <div className="flex gap-8 text-sm text-gray-600">
          <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-orange-500" /> +27 76 488 0159</span>
          <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-orange-500" /> skillconnect.cw@gmail.com</span>
          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-orange-500" /> Chatsworth, Durban, KwaZulu-Natal</span>
        </div>
        <p className="text-xs text-gray-400 mt-2">For partnership enquiries visit: skillconnect.vercel.app/partner</p>
      </div>

      {/* CTA — hidden on print */}
      <section className="print:hidden bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold mb-1">Want to partner with us?</h2>
            <p className="text-gray-400 text-sm">
              We&apos;re open to municipal partnerships, NGO collaborations, and community pilot programmes.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link href="/partner" className="bg-[#007A4D] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#005c39] transition-colors flex items-center gap-2">
              Partner with us <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/workers" className="border border-white text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-white/10 transition-colors">
              Meet our workers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
