import Link from "next/link";
import { Shield } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — SkillConnect",
  description: "SkillConnect POPIA-compliant privacy policy. How we collect, use and protect your personal information.",
};

const EFFECTIVE_DATE = "1 January 2025";
const CONTACT_EMAIL = "skillconnect.cw@gmail.com";
const CONTACT_PHONE = "+27 76 488 0159";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-[#e8f5ef] rounded-xl flex items-center justify-center flex-shrink-0">
          <Shield className="w-5 h-5 text-[#007A4D]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="text-sm text-gray-500">Effective date: {EFFECTIVE_DATE}</p>
        </div>
      </div>

      <div className="bg-[#e8f5ef] border border-[#c3e6d4] rounded-2xl p-4 mb-8 text-sm text-[#005c39]">
        This policy complies with the <strong>Protection of Personal Information Act (POPIA), Act 4 of 2013</strong> of
        the Republic of South Africa. By using SkillConnect you agree to the practices described here.
      </div>

      <div className="prose prose-gray max-w-none space-y-8 text-sm text-gray-700 leading-relaxed">

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">1. Who we are (Responsible Party)</h2>
          <p>
            <strong>SkillConnect</strong> operates as a locality-first labour marketplace based in Sweetwaters, Pietermaritzburg, Durban,
            KwaZulu-Natal, South Africa. We are the Responsible Party as defined under POPIA.
          </p>
          <p className="mt-2">
            Contact: <a href={`mailto:${CONTACT_EMAIL}`} className="text-orange-600 underline">{CONTACT_EMAIL}</a> ·{" "}
            <a href={`tel:${CONTACT_PHONE}`} className="text-orange-600 underline">{CONTACT_PHONE}</a>
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">2. What personal information we collect</h2>
          <h3 className="font-semibold text-gray-800 mt-3 mb-1">From workers (service providers):</h3>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Full name and mobile number</li>
            <li>Trade / skill and years of experience</li>
            <li>Residential area and ward</li>
            <li>Profile photograph (selfie)</li>
            <li>Copy of ID document (South African ID, passport, or equivalent)</li>
            <li>Short biography and work description</li>
          </ul>
          <h3 className="font-semibold text-gray-800 mt-3 mb-1">From clients (job requesters):</h3>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Full name and mobile number</li>
            <li>Street address / area of the job</li>
            <li>Description of the work required</li>
            <li>Optional photo of the job site</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">3. Why we collect this information (Purpose)</h2>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>To verify worker identities and create trusted public profiles</li>
            <li>To match clients with the most suitable, available, local worker</li>
            <li>To facilitate communication between clients and workers via WhatsApp</li>
            <li>To calculate and record commission on completed jobs</li>
            <li>To allow clients to leave reviews and improve service quality</li>
            <li>To comply with our legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">4. Legal basis for processing</h2>
          <p>We process your personal information on the following bases under POPIA:</p>
          <ul className="list-disc list-inside space-y-1 pl-2 mt-2">
            <li><strong>Consent</strong> — you tick the consent checkbox before submitting any form.</li>
            <li><strong>Contractual necessity</strong> — to fulfil the service you requested.</li>
            <li><strong>Legitimate interest</strong> — to operate the platform safely and improve matching.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">5. How we share your information</h2>
          <p>We do <strong>not</strong> sell your personal information. We share it only as follows:</p>
          <ul className="list-disc list-inside space-y-1 pl-2 mt-2">
            <li><strong>Worker profiles</strong> (name, trade, area, rating, bio) are visible to the public on this platform.</li>
            <li><strong>Worker phone numbers</strong> are shared with matched clients so they can make contact.</li>
            <li><strong>Client phone numbers</strong> are shared with the matched worker to arrange the job.</li>
            <li><strong>ID documents</strong> are only accessible to the SkillConnect admin team for verification. They are never shared with clients or other workers.</li>
            <li><strong>Technology providers</strong>: We use Supabase (data storage) and Vercel (hosting). These providers process data on our behalf under their own privacy and security policies.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">6. How long we keep your information</h2>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Worker profiles are retained for as long as the worker remains on the platform.</li>
            <li>Job records are retained for 3 years for commission and dispute resolution purposes.</li>
            <li>Reviews are retained indefinitely as part of the public rating system.</li>
            <li>You may request deletion of your data at any time (see Section 8).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">7. How we protect your information</h2>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>All data is stored in a secured Supabase database with row-level access controls.</li>
            <li>The platform is served over HTTPS (TLS encryption in transit).</li>
            <li>Admin access is password-protected.</li>
            <li>ID documents are stored as encrypted base64 strings, not publicly indexed.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">8. Your rights under POPIA</h2>
          <p>You have the right to:</p>
          <ul className="list-disc list-inside space-y-1 pl-2 mt-2">
            <li><strong>Access</strong> the personal information we hold about you</li>
            <li><strong>Correct</strong> inaccurate or outdated information</li>
            <li><strong>Delete</strong> your information (right to erasure), subject to legal retention requirements</li>
            <li><strong>Object</strong> to the processing of your information</li>
            <li><strong>Withdraw consent</strong> at any time (this will not affect prior lawful processing)</li>
            <li><strong>Complain</strong> to the Information Regulator of South Africa</li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, contact us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-orange-600 underline">{CONTACT_EMAIL}</a>{" "}
            or WhatsApp{" "}
            <a href={`tel:${CONTACT_PHONE}`} className="text-orange-600 underline">{CONTACT_PHONE}</a>.
            We will respond within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">9. Information Regulator</h2>
          <p>
            If you believe we have processed your information unlawfully, you have the right to lodge a
            complaint with the Information Regulator (South Africa):
          </p>
          <p className="mt-2 bg-gray-50 rounded-xl p-3">
            <strong>The Information Regulator (South Africa)</strong><br />
            JD House, 27 Stiemens Street, Braamfontein, Johannesburg, 2001<br />
            Email: inforeg@justice.gov.za
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">10. Changes to this policy</h2>
          <p>
            We may update this policy as the platform evolves. Material changes will be communicated via
            the platform. The effective date at the top of this page will always reflect the latest version.
          </p>
        </section>
      </div>

      <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
        <Link href="/" className="text-sm text-orange-600 hover:underline">← Back to home</Link>
        <Link href="/register" className="text-sm text-orange-600 hover:underline">Register as a worker</Link>
        <Link href="/find-worker" className="text-sm text-orange-600 hover:underline">Request a worker</Link>
      </div>
    </div>
  );
}
