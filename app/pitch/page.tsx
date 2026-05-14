import Link from "next/link";
import {
  Users, Briefcase, TrendingUp, MapPin, Shield, Star,
  Wrench, Zap, Hammer, ArrowRight, CheckCircle,
  Phone, Mail, Globe, AlertTriangle, Target, Lightbulb,
  BarChart3, Heart,
} from "lucide-react";
import PrintButton from "@/components/PrintButton";
import { LogoMark } from "@/components/Logo";

export const metadata = {
  title: "SkillConnect — Stakeholder Brief",
  description:
    "A full platform overview and investment brief for SkillConnect — the locality-first skilled-labour marketplace connecting communities in Sweetwaters, Pietermaritzburg.",
};

const problems = [
  {
    stat: "32.7%",
    label: "Unemployment rate",
    detail: "One of the highest in the world. StatsSA Q1 2026.",
    icon: AlertTriangle,
    bg: "bg-red-50",
    fg: "text-red-600",
  },
  {
    stat: "46.1%",
    label: "Youth unemployment",
    detail: "Ages 15–34. StatsSA QLFS Q1 2025.",
    icon: AlertTriangle,
    bg: "bg-orange-50",
    fg: "text-orange-600",
  },
  {
    stat: "79%",
    label: "Informal businesses invisible online",
    detail: "Not listed on any digital platform — not even Google Maps. Acalytica mapping study.",
    icon: AlertTriangle,
    bg: "bg-red-50",
    fg: "text-red-600",
  },
  {
    stat: "R900bn+",
    label: "Township economy value",
    detail: "Largely untapped due to money leaking out of communities. Daily Investor 2024.",
    icon: TrendingUp,
    bg: "bg-amber-50",
    fg: "text-amber-700",
  },
];

const solution = [
  {
    icon: MapPin,
    title: "Locality-first matching",
    desc: "Workers from the client's own ward are prioritised. A plumber in Ward 4 gets the Ward 4 job first. Money circulates locally.",
  },
  {
    icon: Shield,
    title: "Worker verification",
    desc: "Every worker is vetted: ID, proof of local residence, and portfolio photos of past work. No certificate required — skill is demonstrated.",
  },
  {
    icon: Star,
    title: "Transparent reviews",
    desc: "Real community ratings after every job. Clients know who they are letting into their home before they arrive.",
  },
  {
    icon: Globe,
    title: "Mobile-first platform",
    desc: "Works on any smartphone — no app download required. Built for the 74.7% of South Africans who access the internet via mobile. DataReportal 2024.",
  },
];

const model = [
  { label: "Free for workers to register", detail: "No upfront costs. Workers join, get verified, and start receiving job requests at no charge." },
  { label: "Free for clients to request", detail: "Clients describe the job, get matched, and communicate with workers — all at no cost." },
  { label: "6–12% commission on completion", detail: "SkillConnect earns only when a job is successfully completed. Incentives are aligned with the community." },
  { label: "No hidden fees", detail: "Transparent at every step. Workers keep the majority of what they earn." },
];

const trades = ["Plumber", "Electrician", "Carpenter", "Painter", "Tiler", "Builder", "Welder", "General Handyman"];

const differentiators = [
  {
    icon: Heart,
    title: "Community-embedded, not extractive",
    desc: "Unlike national gig platforms that extract commission and redirect value to distant shareholders, SkillConnect is built by and for the Sweetwaters community, with plans to expand ward by ward.",
  },
  {
    icon: Target,
    title: "Aligned with national LED policy",
    desc: "COGTA's National LED Framework 2018–2028 tasks municipalities with driving local economic development. SkillConnect operationalises this at ground level — no government budget required.",
  },
  {
    icon: Lightbulb,
    title: "Low barrier to entry",
    desc: "No formal certificate needed to register. Workers upload photos of their work and a local reference. This includes the 2% of certificated artisans who are self-employed and the many more operating informally without any certificate. (DHET Tracer Study)",
  },
  {
    icon: Shield,
    title: "POPIA compliant from day one",
    desc: "Full Privacy Policy and data consent flows are built into every registration. Worker and client data is protected in line with South Africa's Protection of Personal Information Act.",
  },
];

const roadmap = [
  {
    phase: "Phase 1",
    title: "Sweetwaters Pilot (Current)",
    items: [
      "Platform live and operational",
      "Worker onboarding and admin approval workflow",
      "Job matching and ratings system",
      "Partner inquiry infrastructure",
      "15–30 verified workers target",
    ],
    status: "active",
  },
  {
    phase: "Phase 2",
    title: "Pietermaritzburg Expansion",
    items: [
      "Expand to all wards of Msunduzi Municipality",
      "Municipal partnership MOU",
      "WhatsApp Business API integration",
      "Worker earnings dashboard",
      "Satellite community onboarding events",
    ],
    status: "upcoming",
  },
  {
    phase: "Phase 3",
    title: "KwaZulu-Natal Scale",
    items: [
      "Replicate model across KZN townships",
      "Registered SMME entity (CIPC)",
      "SEDA and Harambee partnership",
      "Formal TVET college referral pipeline",
      "Employer of record model for top workers",
    ],
    status: "future",
  },
];

const partnerships = [
  { type: "Municipal / Government", desc: "Co-branding, LED programme integration, ward-level rollout support, subsidy for worker data costs." },
  { type: "NGO / Development", desc: "Youth skills programmes, livelihood projects, worker training pipelines feeding into the platform." },
  { type: "Corporate / CSI", desc: "CSI spend directed toward community skill development and platform worker stipends during pilot phase." },
  { type: "TVET / Education", desc: "Referral pipeline from college graduates into the platform — first jobs, verified profiles, peer mentorship." },
  { type: "Financial Services", desc: "Worker savings, micro-insurance, and credit products built on verified income and job history." },
];

const generated = new Date().toLocaleDateString("en-ZA", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function PitchPage() {
  return (
    <div className="flex flex-col text-gray-800">

      {/* ── PRINT HEADER (hidden on screen) ── */}
      <div className="hidden print:flex items-center justify-between px-10 pt-8 pb-5 border-b-2 border-gray-200">
        <div className="flex items-center gap-3">
          <LogoMark className="w-10 h-10" />
          <div>
            <p className="text-xl font-extrabold text-orange-600">SkillConnect</p>
            <p className="text-xs text-gray-500">Local skills. Local jobs. Local money.</p>
          </div>
        </div>
        <div className="text-right text-xs text-gray-400">
          <p className="font-semibold text-gray-600">Stakeholder Brief</p>
          <p>Generated: {generated}</p>
          <p>Sweetwaters, Pietermaritzburg, KwaZulu-Natal</p>
          <p>Confidential — Not for public distribution</p>
        </div>
      </div>

      {/* ── HERO (screen only) ── */}
      <section className="print:hidden bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 text-white">
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 text-white text-sm px-4 py-1.5 rounded-full mb-6 font-medium">
            Stakeholder Brief · {generated}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-5">
            Turning invisible skills<br />into visible livelihoods
          </h1>
          <p className="text-lg md:text-xl text-orange-100 max-w-3xl mx-auto mb-8">
            SkillConnect is a locality-first digital labour marketplace connecting verified skilled
            workers with clients in their own community — starting in Sweetwaters, Pietermaritzburg,
            and expanding across KwaZulu-Natal.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <PrintButton />
            <Link
              href="/partner"
              className="border-2 border-white text-white font-semibold px-7 py-3 rounded-full hover:bg-white/10 transition-colors flex items-center gap-2 justify-center"
            >
              Partner with us <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── PRINT TITLE ── */}
      <div className="hidden print:block px-10 py-6">
        <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
          Turning Invisible Skills into Visible Livelihoods
        </h1>
        <p className="text-base text-orange-600 font-semibold mt-1">
          SkillConnect — Stakeholder Brief {generated}
        </p>
        <p className="text-sm text-gray-500 mt-2 max-w-3xl">
          SkillConnect is a locality-first digital labour marketplace connecting verified skilled
          workers with clients in their own community. Launched in Sweetwaters, Pietermaritzburg,
          KwaZulu-Natal, with a clear path to municipal-scale expansion.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 print:px-10 w-full">

        {/* ── PRINT BUTTON (screen only) ── */}
        <div className="print:hidden pt-8 flex justify-end">
          <PrintButton />
        </div>

        {/* ══════════════════════════════════════════
            SECTION 1 — EXECUTIVE SUMMARY
        ══════════════════════════════════════════ */}
        <section className="py-14 print:py-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
            <h2 className="text-2xl font-extrabold text-gray-900 print:text-xl">Executive Summary</h2>
          </div>
          <div className="bg-orange-50 border border-orange-100 rounded-3xl p-8 print:rounded-xl print:p-5">
            <p className="text-gray-700 leading-relaxed mb-4 print:text-sm">
              South Africa faces one of the world's worst unemployment crises — yet millions of skilled
              workers exist in every township and peri-urban community, ready to work. The gap is not a
              lack of skill. The gap is <strong>visibility, trust, and connection</strong>.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4 print:text-sm">
              SkillConnect closes that gap. Our platform allows any community member to find a verified
              local plumber, electrician, carpenter, painter, tiler, builder, or welder within minutes —
              using nothing more than a smartphone. Workers earn more consistently. Clients hire with
              confidence. Money that previously left the community now circulates within it.
            </p>
            <p className="text-gray-700 leading-relaxed print:text-sm">
              We operate on a <strong>commission-only model</strong> (6–12%, charged on completion only),
              meaning we only earn when local workers earn. We are currently in active pilot in
              Sweetwaters, Pietermaritzburg — and we are seeking municipal partnerships, NGO
              collaborations, and strategic investors to accelerate ward-by-ward expansion across KZN.
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 2 — THE PROBLEM
        ══════════════════════════════════════════ */}
        <section className="py-8 print:py-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
            <h2 className="text-2xl font-extrabold text-gray-900 print:text-xl">The Problem</h2>
          </div>
          <p className="text-gray-500 mb-6 print:text-sm">
            South Africa&apos;s labour market crisis is structural, severe, and disproportionately
            concentrated in peri-urban and township communities. These are the communities SkillConnect
            is built to serve.
          </p>

          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 print:gap-3">
            {problems.map(({ stat, label, detail, icon: Icon, bg, fg }) => (
              <div key={label} className="bg-white border border-gray-100 rounded-2xl p-5 print:rounded-lg print:p-3 flex flex-col gap-2">
                <div className={`w-9 h-9 print:w-7 print:h-7 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 print:w-4 print:h-4 ${fg}`} />
                </div>
                <p className="text-2xl print:text-xl font-extrabold text-gray-900 leading-tight">{stat}</p>
                <p className="text-sm print:text-xs font-semibold text-gray-700">{label}</p>
                <p className="text-xs text-gray-400 print:text-[10px]">{detail}</p>
              </div>
            ))}
          </div>

          {/* Narrative problems */}
          <div className="space-y-5">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 print:rounded-lg print:p-4">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2 print:text-sm">
                <Wrench className="w-4 h-4 text-orange-500 flex-shrink-0" /> The artisan shortage paradox
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed print:text-xs">
                South Africa faces a documented artisan shortage — plumbers, electricians, welders, and
                carpenters are explicitly listed on the <em>2024 National List of Occupations in High
                Demand</em> (DHET). Yet DHET tracer studies show that <strong>19% of artisans who pass
                trade tests are unemployed</strong>, and <strong>2% are self-employed</strong>. Many more
                operate informally without any certificate. The problem is not supply — it is the absence
                of a reliable channel connecting skilled workers to paying clients.
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 print:rounded-lg print:p-4">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2 print:text-sm">
                <Globe className="w-4 h-4 text-orange-500 flex-shrink-0" /> Digital invisibility at scale
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed print:text-xs">
                A formal mapping exercise found that <strong>79% of informal businesses are not listed on
                any digital platform</strong> — not even Google Maps (Acalytica). This means skilled
                workers who have spent years developing their craft are entirely invisible to potential
                clients searching online. Without digital presence, they rely entirely on word-of-mouth
                — which severely limits their earning potential and geographic reach, even within their
                own community.
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 print:rounded-lg print:p-4">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2 print:text-sm">
                <TrendingUp className="w-4 h-4 text-orange-500 flex-shrink-0" /> The R900 billion township economy leaks
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed print:text-xs">
                South Africa&apos;s township economy is estimated at <strong>R900 billion to R1 trillion
                annually</strong> (Daily Investor, 2024). Yet much of this money leaks out of communities
                because residents cannot access reliable local skilled labour for home improvements,
                repairs, and construction — and instead hire from outside the ward or delay work
                indefinitely. Every job captured by an outsider is money that does not stay local.
                SkillConnect is a mechanism for economic retention.
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 3 — OUR SOLUTION
        ══════════════════════════════════════════ */}
        <section className="py-8 print:py-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
            <h2 className="text-2xl font-extrabold text-gray-900 print:text-xl">Our Solution</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4 print:gap-3">
            {solution.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-gray-100 rounded-2xl p-6 print:rounded-lg print:p-4 flex gap-4">
                <div className="w-10 h-10 print:w-8 print:h-8 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 print:w-4 print:h-4 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1 print:text-sm">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed print:text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Trades */}
          <div className="mt-6 bg-[#f0f7f4] rounded-2xl print:rounded-lg p-6 print:p-4">
            <h3 className="font-bold text-[#007A4D] mb-3 print:text-sm">Trades currently on the platform</h3>
            <div className="flex flex-wrap gap-2">
              {trades.map((t) => (
                <span key={t} className="flex items-center gap-1.5 bg-white border border-[#c3e6d8] text-[#007A4D] text-sm print:text-xs font-medium px-3 py-1.5 rounded-full">
                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" /> {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 4 — HOW IT WORKS
        ══════════════════════════════════════════ */}
        <section className="py-8 print:py-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">4</div>
            <h2 className="text-2xl font-extrabold text-gray-900 print:text-xl">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 print:gap-4">
            <div className="bg-orange-50 rounded-2xl print:rounded-lg p-6 print:p-4">
              <h3 className="font-bold text-orange-700 mb-4 flex items-center gap-2 print:text-sm">
                <MapPin className="w-4 h-4" /> For clients
              </h3>
              <ol className="space-y-3">
                {[
                  ["Tell us what you need", "Select the trade, describe the job — no long forms."],
                  ["Get matched instantly", "Our locality-first algorithm finds the best available worker in your ward."],
                  ["Confirm and get it done", "Review the worker's verified profile and ratings, confirm, and they come to you."],
                  ["Rate your experience", "Leave an honest review so the next client knows what to expect."],
                ].map(([title, desc], i) => (
                  <li key={title} className="flex gap-3">
                    <div className="w-6 h-6 print:w-5 print:h-5 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">{i + 1}</div>
                    <div>
                      <p className="font-semibold text-sm print:text-xs text-gray-900">{title}</p>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="bg-[#f0f7f4] rounded-2xl print:rounded-lg p-6 print:p-4">
              <h3 className="font-bold text-[#007A4D] mb-4 flex items-center gap-2 print:text-sm">
                <Hammer className="w-4 h-4" /> For workers
              </h3>
              <ol className="space-y-3">
                {[
                  ["Register your skills", "Share your trade, location, and photos of past work. No formal certificate required."],
                  ["Get verified by our team", "We confirm your details within 48 hours and add you to the platform."],
                  ["Receive job requests", "Clients in your ward find you first. You choose which jobs to accept."],
                  ["Get paid and grow", "Clients pay you directly. A small commission is deducted only on completion."],
                ].map(([title, desc], i) => (
                  <li key={title} className="flex gap-3">
                    <div className="w-6 h-6 print:w-5 print:h-5 rounded-full bg-[#007A4D] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">{i + 1}</div>
                    <div>
                      <p className="font-semibold text-sm print:text-xs text-gray-900">{title}</p>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 5 — BUSINESS MODEL
        ══════════════════════════════════════════ */}
        <section className="py-8 print:py-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">5</div>
            <h2 className="text-2xl font-extrabold text-gray-900 print:text-xl">Business Model</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {model.map(({ label, detail }) => (
              <div key={label} className="bg-white border border-gray-100 rounded-2xl print:rounded-lg p-5 print:p-3 flex gap-3">
                <CheckCircle className="w-5 h-5 text-[#007A4D] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm print:text-xs">{label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{detail}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 bg-[#fffbea] border border-[#fde68a] rounded-2xl print:rounded-lg p-5 print:p-3">
            <p className="text-sm print:text-xs text-[#92400e] leading-relaxed">
              <strong>Revenue alignment:</strong> SkillConnect earns only when a job is completed —
              meaning our commercial incentives are identical to the community&apos;s interests. We grow
              by helping workers earn more, not by charging them for access or taking upfront fees they
              cannot afford.
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 6 — MARKET OPPORTUNITY
        ══════════════════════════════════════════ */}
        <section className="py-8 print:py-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">6</div>
            <h2 className="text-2xl font-extrabold text-gray-900 print:text-xl">Market Opportunity</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {[
              { value: "~2.9M", label: "Informal businesses in SA", source: "StatsSA 2022" },
              { value: "42%", label: "Workforce in informal sector", source: "StatsSA QLFS 2024" },
              { value: "R900bn", label: "Annual township economy", source: "Daily Investor 2024" },
              { value: "74.7%", label: "SA internet penetration", source: "DataReportal 2024" },
              { value: "19%", label: "Certified artisans unemployed", source: "DHET Tracer Study" },
              { value: "39%", label: "Smartphone penetration by 2029", source: "Statista" },
            ].map(({ value, label, source }) => (
              <div key={label} className="bg-white border border-gray-100 rounded-2xl print:rounded-lg p-5 print:p-3 text-center">
                <p className="text-2xl print:text-xl font-extrabold text-orange-600">{value}</p>
                <p className="text-sm print:text-xs font-semibold text-gray-700 mt-1">{label}</p>
                <p className="text-xs text-gray-400 print:text-[10px] mt-0.5">{source}</p>
              </div>
            ))}
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl print:rounded-lg p-6 print:p-4">
            <h3 className="font-bold text-gray-900 mb-2 print:text-sm">Policy tailwind: COGTA&apos;s National LED Framework 2018–2028</h3>
            <p className="text-sm print:text-xs text-gray-600 leading-relaxed">
              South Africa&apos;s national LED Framework explicitly tasks municipalities with driving local
              economic development — and identifies townships as priority zones. The OECD&apos;s 2025
              Economic Survey of South Africa explicitly recommends reducing digital and financial barriers
              for informal businesses. SkillConnect is not working against policy — it is the operational
              implementation of what these frameworks call for, built and deployed at ground level without
              requiring a municipal budget.
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 7 — WHY SKILLCONNECT
        ══════════════════════════════════════════ */}
        <section className="py-8 print:py-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">7</div>
            <h2 className="text-2xl font-extrabold text-gray-900 print:text-xl">Why SkillConnect?</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {differentiators.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-gray-100 rounded-2xl print:rounded-lg p-6 print:p-4 flex gap-4">
                <div className="w-10 h-10 print:w-8 print:h-8 bg-[#e8f5ef] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 print:w-4 print:h-4 text-[#007A4D]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1 print:text-sm">{title}</h3>
                  <p className="text-sm print:text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 8 — ROADMAP
        ══════════════════════════════════════════ */}
        <section className="py-8 print:py-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">8</div>
            <h2 className="text-2xl font-extrabold text-gray-900 print:text-xl">Roadmap</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 print:gap-3">
            {roadmap.map(({ phase, title, items, status }) => (
              <div
                key={phase}
                className={`rounded-2xl print:rounded-lg p-6 print:p-4 border ${
                  status === "active"
                    ? "bg-orange-50 border-orange-200"
                    : status === "upcoming"
                    ? "bg-[#f0f7f4] border-[#c3e6d8]"
                    : "bg-white border-gray-100"
                }`}
              >
                <div className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-3 ${
                  status === "active"
                    ? "bg-orange-600 text-white"
                    : status === "upcoming"
                    ? "bg-[#007A4D] text-white"
                    : "bg-gray-100 text-gray-500"
                }`}>
                  {phase} {status === "active" ? "· Active" : status === "upcoming" ? "· Next" : "· Future"}
                </div>
                <h3 className="font-bold text-gray-900 mb-3 print:text-sm">{title}</h3>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item} className="flex gap-2 text-sm print:text-xs text-gray-600">
                      <CheckCircle className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${
                        status === "active" ? "text-orange-500" : status === "upcoming" ? "text-[#007A4D]" : "text-gray-300"
                      }`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 9 — PARTNERSHIPS
        ══════════════════════════════════════════ */}
        <section className="py-8 print:py-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">9</div>
            <h2 className="text-2xl font-extrabold text-gray-900 print:text-xl">Partnership Opportunities</h2>
          </div>
          <p className="text-gray-500 mb-5 print:text-sm">
            We are actively seeking partners who share our commitment to local economic development.
            All partnerships are structured to be mutually beneficial and measurable.
          </p>
          <div className="space-y-3">
            {partnerships.map(({ type, desc }) => (
              <div key={type} className="bg-white border border-gray-100 rounded-xl print:rounded-lg p-5 print:p-3 flex gap-4 items-start">
                <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0 mt-2" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm print:text-xs">{type}</p>
                  <p className="text-sm print:text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 10 — CONTACT
        ══════════════════════════════════════════ */}
        <section className="py-8 print:py-6 mb-8 print:mb-0">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">10</div>
            <h2 className="text-2xl font-extrabold text-gray-900 print:text-xl">Contact Us</h2>
          </div>
          <div className="bg-gray-900 print:bg-white print:border print:border-gray-200 rounded-3xl print:rounded-xl p-8 print:p-5 text-white print:text-gray-900">
            <div className="grid md:grid-cols-2 gap-8 print:gap-5">
              <div>
                <h3 className="font-bold text-lg print:text-base mb-4">Get in touch</h3>
                <div className="space-y-3">
                  <a href="tel:+27764880159" className="flex items-center gap-3 text-sm print:text-xs text-gray-300 print:text-gray-600 hover:text-orange-400 transition-colors">
                    <Phone className="w-4 h-4 text-orange-500 flex-shrink-0" /> +27 76 488 0159
                  </a>
                  <a href="tel:+27679467770" className="flex items-center gap-3 text-sm print:text-xs text-gray-300 print:text-gray-600 hover:text-orange-400 transition-colors">
                    <Phone className="w-4 h-4 text-orange-500 flex-shrink-0" /> +27 67 946 7770 (WhatsApp)
                  </a>
                  <a href="mailto:skillconnect.cw@gmail.com" className="flex items-center gap-3 text-sm print:text-xs text-gray-300 print:text-gray-600 hover:text-orange-400 transition-colors">
                    <Mail className="w-4 h-4 text-orange-500 flex-shrink-0" /> skillconnect.cw@gmail.com
                  </a>
                  <div className="flex items-center gap-3 text-sm print:text-xs text-gray-300 print:text-gray-600">
                    <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" /> Sweetwaters, Pietermaritzburg, KwaZulu-Natal
                  </div>
                  <a href="https://skillconnect.vercel.app" className="flex items-center gap-3 text-sm print:text-xs text-gray-300 print:text-gray-600 hover:text-orange-400 transition-colors">
                    <Globe className="w-4 h-4 text-orange-500 flex-shrink-0" /> skillconnect.vercel.app
                  </a>
                </div>
              </div>
              <div className="print:hidden">
                <h3 className="font-bold text-lg mb-4">Ready to partner?</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Submit a partnership inquiry directly on the platform and we will respond within 48 hours.
                </p>
                <Link
                  href="/partner"
                  className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-700 transition-colors text-sm"
                >
                  Submit a Partnership Inquiry <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* ── PRINT FOOTER ── */}
      <div className="hidden print:block px-10 py-5 border-t-2 border-gray-200 mt-4 text-xs text-gray-400">
        <div className="flex justify-between">
          <span>© {new Date().getFullYear()} SkillConnect · Sweetwaters, Pietermaritzburg, KwaZulu-Natal</span>
          <span>Confidential — Stakeholder Brief · Not for public distribution</span>
        </div>
        <p className="mt-1">Platform: skillconnect.vercel.app · Email: skillconnect.cw@gmail.com · WhatsApp: +27 67 946 7770</p>
      </div>

      {/* ── CTA BANNER (screen only) ── */}
      <section className="print:hidden bg-gradient-to-r from-orange-600 to-amber-500 text-white">
        <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">Let&apos;s build this together</h2>
            <p className="text-orange-100 text-sm">
              SkillConnect is open to municipal partnerships, NGO collaborations, and strategic investors.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link href="/partner" className="bg-white text-orange-600 font-semibold px-6 py-3 rounded-full hover:bg-orange-50 transition-colors flex items-center gap-2">
              Partner with us <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/impact" className="border-2 border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition-colors">
              View live impact data
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
